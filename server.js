import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { createRequire } from 'module'
import { spawn } from 'child_process'

const require = createRequire(import.meta.url)
const ffmpegStatic = require('ffmpeg-static')
const FFMPEG = ffmpegStatic || '/opt/homebrew/bin/ffmpeg'
const YTDLP  = process.env.YTDLP_PATH || '/opt/homebrew/bin/yt-dlp'

const app  = express()
const PORT = process.env.PORT || 3001
const isProd = process.env.NODE_ENV === 'production'

// ── Allowed origins ───────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://yttune.app',
  'https://www.yttune.app',
  process.env.FRONTEND_URL,
].filter(Boolean)

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({
  origin: isProd ? ALLOWED_ORIGINS : '*',
  methods: ['GET'],
}))

// ── Rate limiting ─────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 60 * 1000,   // 1 minute
  max: 30,               // 30 requests/min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
})
app.use('/api', limiter)

// ── YouTube URL validation ────────────────────────────────────────────────────
const isValidYouTubeUrl = (url) =>
  /^https?:\/\/(www\.)?(youtube\.com\/watch\?.*v=[\w-]{11}|youtu\.be\/[\w-]{11}|youtube\.com\/shorts\/[\w-]{11})/.test(url)

// ── shared: get video info fast ──────────────────────────────────────────────
function getVideoInfo(url) {
  return new Promise((resolve, reject) => {
    const proc = spawn(YTDLP, ['--print', '%(title)s\n%(thumbnail)s', '--no-playlist', url])
    let out = ''
    proc.stdout.on('data', (d) => out += d)
    proc.on('close', (code) => {
      if (code !== 0) return reject(new Error('yt-dlp info failed'))
      const [title = 'Track', thumb = ''] = out.trim().split('\n')
      resolve({ title, thumb })
    })
  })
}

// ── MP3: yt-dlp → ffmpeg → stream ────────────────────────────────────────────
app.get('/api/mp3', async (req, res) => {
  const { url } = req.query
  if (!url) return res.status(400).json({ error: 'url required' })
  const decoded = decodeURIComponent(url)
  if (!isValidYouTubeUrl(decoded)) return res.status(400).json({ error: 'Invalid YouTube URL' })

  try {
    const { title, thumb } = await getVideoInfo(decoded)
    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase()

    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.mp3"`)
    res.setHeader('X-Video-Title', encodeURIComponent(title))
    res.setHeader('X-Video-Thumb', encodeURIComponent(thumb))
    res.setHeader('Cache-Control', 'no-store')

    // Stream audio via yt-dlp | ffmpeg
    const ytProc = spawn(YTDLP, [
      '-f', 'bestaudio',
      '--no-playlist',
      '-o', '-',
      decoded
    ])

    const ffProc = spawn(FFMPEG, [
      '-i', 'pipe:0',
      '-vn',
      '-ab', '128k',
      '-f', 'mp3',
      'pipe:1'
    ])

    ytProc.stdout.pipe(ffProc.stdin)
    ffProc.stdout.pipe(res)

    ytProc.on('error', (e) => { console.error('[yt-dlp]', e.message); res.destroy() })
    ffProc.on('error', (e) => { console.error('[ffmpeg]', e.message); res.destroy() })
    ffProc.stderr.on('data', (d) => console.log('[ffmpeg]', d.toString()))
    ytProc.stderr.on('data', (d) => console.log('[yt-dlp]', d.toString()))

    res.on('close', () => { ytProc.kill(); ffProc.kill() })
  } catch (e) {
    console.error('[mp3]', e.message)
    if (!res.headersSent) res.status(502).json({ error: e.message || 'Failed to fetch video' })
  }
})

// ── MP4: yt-dlp → stream ──────────────────────────────────────────────────────
app.get('/api/mp4', async (req, res) => {
  const { url, resolution = '720' } = req.query
  if (!url) return res.status(400).json({ error: 'url required' })
  const decoded = decodeURIComponent(url)
  if (!isValidYouTubeUrl(decoded)) return res.status(400).json({ error: 'Invalid YouTube URL' })

  try {
    const { title, thumb } = await getVideoInfo(decoded)
    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase()

    res.setHeader('Content-Type', 'video/mp4')
    res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.mp4"`)
    res.setHeader('X-Video-Title', encodeURIComponent(title))
    res.setHeader('X-Video-Thumb', encodeURIComponent(thumb))
    res.setHeader('Cache-Control', 'no-store')

    const format = `bestvideo[height<=${resolution}][ext=mp4]+bestaudio[ext=m4a]/best[height<=${resolution}][ext=mp4]/best[height<=${resolution}]`
    const ytProc = spawn(YTDLP, [
      '-f', format,
      '--no-playlist',
      '--merge-output-format', 'mp4',
      '-o', '-',
      decoded
    ])

    ytProc.stdout.pipe(res)
    ytProc.stderr.on('data', (d) => console.log('[yt-dlp mp4]', d.toString()))
    ytProc.on('error', (e) => { console.error('[yt-dlp mp4]', e.message); if (!res.headersSent) res.destroy() })
    res.on('close', () => ytProc.kill())
  } catch (e) {
    console.error('[mp4]', e.message)
    if (!res.headersSent) res.status(502).json({ error: e.message || 'Failed to fetch video' })
  }
})
async function fetchTranscript(videoId) {
  try {
    const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(10000),
    })
    const html = await pageRes.text()
    const match = html.match(/"captionTracks":\s*(\[.*?\])/)
    if (!match) return 'Transcript not available for this video.'
    const tracks = JSON.parse(match[1])
    const track = tracks.find(t => t.languageCode === 'en') || tracks[0]
    if (!track) return 'Transcript not available for this video.'
    const xmlRes = await fetch(track.baseUrl, { signal: AbortSignal.timeout(10000) })
    const xml = await xmlRes.text()
    return [...xml.matchAll(/<text[^>]*>([^<]*)<\/text>/g)]
      .map(m => m[1].replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>'))
      .join(' ')
  } catch {
    return 'Transcript not available for this video.'
  }
}

app.get('/api/yt-info', async (req, res) => {
  const { url } = req.query
  if (!url) return res.status(400).json({ error: 'url required' })
  const match = url.match(/(?:v=|youtu\.be\/)([\w-]{11})/)
  if (!match) return res.status(400).json({ error: 'Invalid YouTube URL' })
  const videoId = match[1]
  try {
    const transcript = await fetchTranscript(videoId)
    let description = '', tags = []
    try {
      const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        signal: AbortSignal.timeout(10000),
      })
      const html = await pageRes.text()
      const dataMatch = html.match(/var ytInitialData = (.*?);<\/script>/s)
      if (dataMatch) {
        try {
          const ytData = JSON.parse(dataMatch[1])
          const contents = ytData?.contents?.twoColumnWatchNextResults?.results?.results?.contents
          if (contents) {
            for (const item of contents) {
              const desc = item?.videoSecondaryInfoRenderer?.attributedDescription?.content
              if (desc) { description = desc; break }
            }
          }
        } catch { /* ignore */ }
      }
      if (!description) {
        const descMatch = html.match(/<meta name="description" content="([^"]+)"/)
        if (descMatch) description = descMatch[1]
      }
      const tagMatch = html.match(/<meta name="keywords" content="([^"]+)"/)
      if (tagMatch) tags = tagMatch[1].split(',').map(t => t.trim()).filter(Boolean)
    } catch { /* ignore */ }
    res.json({ videoId, transcript, description, tags })
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch video info' })
  }
})

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ status: 'ok', ts: Date.now() }))

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_, res) => res.status(404).json({ error: 'Not found' }))

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => console.log(`Server running on port ${PORT} [${isProd ? 'production' : 'development'}]`))

process.on('SIGTERM', () => process.exit(0))
process.on('SIGINT',  () => process.exit(0))
process.on('uncaughtException',  (e) => console.error('Uncaught:', e.message))
process.on('unhandledRejection', (e) => console.error('Unhandled:', e))
