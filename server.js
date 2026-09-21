import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { createRequire } from 'module'
import { spawn } from 'child_process'

import fs from 'fs'
import path from 'path'
import os from 'os'
import { execSync } from 'child_process'

const require = createRequire(import.meta.url)
const ffmpegStatic = require('ffmpeg-static')
const FFMPEG = ffmpegStatic || '/opt/homebrew/bin/ffmpeg'

// Auto-detect yt-dlp binary across common locations
function resolveYtDlp() {
  if (process.env.YTDLP_PATH && fs.existsSync(process.env.YTDLP_PATH)) {
    return process.env.YTDLP_PATH
  }
  const localBin = path.join(process.cwd(), 'yt-dlp')
  if (fs.existsSync(localBin)) {
    try { fs.chmodSync(localBin, 0o755) } catch {}
    return localBin
  }
  const candidates = [
    '/Users/dd-mac-04/Library/Python/3.9/bin/yt-dlp',
    '/opt/homebrew/bin/yt-dlp',
    '/usr/local/bin/yt-dlp',
    '/usr/bin/yt-dlp',
    path.join(process.env.HOME || '', 'Library/Python/3.9/bin/yt-dlp'),
  ]
  for (const c of candidates) {
    if (fs.existsSync(c)) return c
  }
  try {
    const p = execSync('which yt-dlp', { encoding: 'utf8' }).trim()
    if (p && fs.existsSync(p)) return p
  } catch { /* ignore */ }

  // If in cloud environment (Linux container on Render), auto-download standalone binary on boot
  try {
    console.log('[Init] yt-dlp not found in candidates. Auto-downloading standalone binary...')
    execSync('curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o ./yt-dlp && chmod +x ./yt-dlp', { stdio: 'inherit' })
    if (fs.existsSync(localBin)) return localBin
  } catch (err) {
    console.error('[Init] Auto-download of yt-dlp failed:', err.message)
  }

  return 'yt-dlp'
}

const YTDLP = resolveYtDlp()
console.log(`[Init] Using YTDLP at: ${YTDLP}`)
console.log(`[Init] Using FFMPEG at: ${FFMPEG}`)

const app  = express()
const PORT = process.env.PORT || 3001
const isProd = process.env.NODE_ENV === 'production'

// ── Allowed origins ───────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://yttune.app',
  'https://www.yttune.app',
  'https://yttune.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean)

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    if (
      !isProd ||
      ALLOWED_ORIGINS.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.includes('localhost') ||
      origin.includes('yttune')
    ) {
      return callback(null, true)
    }
    return callback(null, true)
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  exposedHeaders: ['X-Video-Title', 'X-Video-Thumb', 'Content-Disposition', 'Content-Length'],
}))

// ── Rate limiting ─────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 60 * 1000,   // 1 minute
  max: 60,               // 60 requests/min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
})
app.use('/api', limiter)

// ── YouTube URL validation ────────────────────────────────────────────────────
const isValidYouTubeUrl = (url) =>
  /^https?:\/\/(www\.)?(youtube\.com\/watch\?.*v=[\w-]{11}|youtu\.be\/[\w-]{11}|youtube\.com\/shorts\/[\w-]{11})/.test(url)

// ── Anti-bot & Cookie Support ────────────────────────────────────────────────
function getCookieArgs() {
  const cookieFile = path.join(process.cwd(), 'cookies.txt')
  if (fs.existsSync(cookieFile)) {
    return ['--cookies', cookieFile]
  }
  if (process.env.YOUTUBE_COOKIES) {
    const tmpCookie = path.join(os.tmpdir(), 'yt_cookies.txt')
    try {
      fs.writeFileSync(tmpCookie, process.env.YOUTUBE_COOKIES.trim(), 'utf8')
      return ['--cookies', tmpCookie]
    } catch (e) {
      console.error('[Cookies] Failed to write temp cookies:', e.message)
    }
  }
  return []
}

function getYtDlpCommonArgs() {
  const cookieArgs = getCookieArgs()
  const baseArgs = [
    '--js-runtimes', 'node',
    '--remote-components', 'ejs:github',
    '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    '--no-check-certificates',
  ]
  if (cookieArgs.length > 0) {
    // When cookies are present, authenticate extraction without forcing restricted player_client
    return [
      ...cookieArgs,
      ...baseArgs,
    ]
  }
  return [
    '--extractor-args', 'youtube:player_client=android,mweb,tv_embedded',
    ...baseArgs,
  ]
}

// ── shared: get video info fast (oEmbed first ~50ms, yt-dlp fallback) ─────────
async function getVideoInfo(url) {
  // 1. Try YouTube oEmbed API for instant title & thumbnail (<100ms)
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    const res = await fetch(oembedUrl, { signal: AbortSignal.timeout(3000) })
    if (res.ok) {
      const data = await res.json()
      if (data?.title) {
        return {
          title: data.title,
          thumb: data.thumbnail_url || ''
        }
      }
    }
  } catch {
    // fallback to yt-dlp below
  }

  // 2. Fallback to yt-dlp with timeout
  return new Promise((resolve, reject) => {
    const args = [
      ...getYtDlpCommonArgs(),
      '--print', '%(title)s\n%(thumbnail)s',
      '--no-playlist',
      '--',
      url
    ]
    const proc = spawn(YTDLP, args)
    let out = ''
    let errOut = ''
    const timer = setTimeout(() => {
      proc.kill()
      reject(new Error('yt-dlp info timed out'))
    }, 12000)

    proc.stdout.on('data', (d) => out += d)
    proc.stderr.on('data', (d) => errOut += d)
    proc.on('error', (err) => {
      clearTimeout(timer)
      reject(err)
    })
    proc.on('close', (code) => {
      clearTimeout(timer)
      if (code !== 0) return reject(new Error(errOut.trim() || 'yt-dlp info failed'))
      const [title = 'Track', thumb = ''] = out.trim().split('\n')
      resolve({ title, thumb })
    })
  })
}

// ── MP3: yt-dlp → mp3 conversion with verified file output ───────────────────
app.get('/api/mp3', async (req, res) => {
  const { url } = req.query
  if (!url) return res.status(400).json({ error: 'url required' })
  const decoded = decodeURIComponent(url)
  if (!isValidYouTubeUrl(decoded)) return res.status(400).json({ error: 'Invalid YouTube URL' })

  const tmpId = `${Date.now()}_${Math.random().toString(36).slice(2)}`
  const tmpFile = path.join(os.tmpdir(), `yttune_${tmpId}.mp3`)

  try {
    const { title, thumb } = await getVideoInfo(decoded)
    const safeTitle = (title || 'audio').replace(/[^a-z0-9]/gi, '_').toLowerCase()

    await new Promise((resolve, reject) => {
      const ytProc = spawn(YTDLP, [
        '--ffmpeg-location', FFMPEG,
        ...getYtDlpCommonArgs(),
        '-f', 'ba/b',
        '-x',
        '--audio-format', 'mp3',
        '--audio-quality', '0',
        '--no-playlist',
        '-o', tmpFile,
        '--',
        decoded
      ])

      let errBuf = ''
      const timer = setTimeout(() => {
        ytProc.kill('SIGKILL')
        reject(new Error('Conversion timed out'))
      }, 120000) // 2 min max

      ytProc.stderr.on('data', (d) => errBuf += d)
      ytProc.on('error', (err) => {
        clearTimeout(timer)
        reject(err)
      })
      ytProc.on('close', (code) => {
        clearTimeout(timer)
        if (code === 0 && fs.existsSync(tmpFile) && fs.statSync(tmpFile).size > 1000) {
          resolve()
        } else {
          reject(new Error(errBuf.slice(-300) || 'Audio extraction failed'))
        }
      })
    })

    const stat = fs.statSync(tmpFile)
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Content-Length', stat.size)
    res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.mp3"`)
    res.setHeader('X-Video-Title', encodeURIComponent(title))
    res.setHeader('X-Video-Thumb', encodeURIComponent(thumb))
    res.setHeader('Cache-Control', 'no-store')

    const stream = fs.createReadStream(tmpFile)
    stream.pipe(res)
    stream.on('end', () => fs.unlink(tmpFile, () => {}))
    stream.on('error', () => fs.unlink(tmpFile, () => {}))
    res.on('close', () => fs.unlink(tmpFile, () => {}))
  } catch (e) {
    console.error('[mp3]', e.message)
    if (fs.existsSync(tmpFile)) fs.unlink(tmpFile, () => {})
    if (!res.headersSent) res.status(502).json({ error: e.message || 'Failed to convert audio' })
  }
})

// ── MP4: yt-dlp → mp4 with verified video & audio file output ────────────────
const ALLOWED_RESOLUTIONS = ['360', '480', '720', '1080', '2160']

app.get('/api/mp4', async (req, res) => {
  const { url, resolution = '720' } = req.query
  if (!url) return res.status(400).json({ error: 'url required' })
  const decoded = decodeURIComponent(url)
  if (!isValidYouTubeUrl(decoded)) return res.status(400).json({ error: 'Invalid YouTube URL' })

  // Security: strictly whitelist resolution to prevent format injection
  const safeRes = ALLOWED_RESOLUTIONS.includes(String(resolution)) ? String(resolution) : '720'

  const tmpId = `${Date.now()}_${Math.random().toString(36).slice(2)}`
  const tmpFile = path.join(os.tmpdir(), `yttune_${tmpId}.mp4`)

  try {
    const { title, thumb } = await getVideoInfo(decoded)
    const safeTitle = (title || 'video').replace(/[^a-z0-9]/gi, '_').toLowerCase()

    const format = `bv*[height<=${safeRes}]+ba/b[height<=${safeRes}]/bv*+ba/best`

    await new Promise((resolve, reject) => {
      const ytProc = spawn(YTDLP, [
        '--ffmpeg-location', FFMPEG,
        ...getYtDlpCommonArgs(),
        '-f', format,
        '--no-playlist',
        '--merge-output-format', 'mp4',
        '-o', tmpFile,
        '--',
        decoded
      ])

      let errBuf = ''
      const timer = setTimeout(() => {
        ytProc.kill('SIGKILL')
        reject(new Error('Download timed out'))
      }, 180000) // 3 min max

      ytProc.stderr.on('data', (d) => errBuf += d)
      ytProc.on('error', (err) => {
        clearTimeout(timer)
        reject(err)
      })
      ytProc.on('close', (code) => {
        clearTimeout(timer)
        if (code === 0 && fs.existsSync(tmpFile) && fs.statSync(tmpFile).size > 1000) {
          resolve()
        } else {
          reject(new Error(errBuf.slice(-300) || 'Video extraction failed'))
        }
      })
    })

    const stat = fs.statSync(tmpFile)
    res.setHeader('Content-Type', 'video/mp4')
    res.setHeader('Content-Length', stat.size)
    res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.mp4"`)
    res.setHeader('X-Video-Title', encodeURIComponent(title))
    res.setHeader('X-Video-Thumb', encodeURIComponent(thumb))
    res.setHeader('Cache-Control', 'no-store')

    const stream = fs.createReadStream(tmpFile)
    stream.pipe(res)
    stream.on('end', () => fs.unlink(tmpFile, () => {}))
    stream.on('error', () => fs.unlink(tmpFile, () => {}))
    res.on('close', () => fs.unlink(tmpFile, () => {}))
  } catch (e) {
    console.error('[mp4]', e.message)
    if (fs.existsSync(tmpFile)) fs.unlink(tmpFile, () => {})
    if (!res.headersSent) res.status(502).json({ error: e.message || 'Failed to download video' })
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

// ── Health check & Root ───────────────────────────────────────────────────────
app.get('/', (_, res) => res.json({
  status: 'ok',
  message: 'YTTune API Server is running',
  cookies_active: Boolean(process.env.YOUTUBE_COOKIES || fs.existsSync(path.join(process.cwd(), 'cookies.txt'))),
  ts: Date.now()
}))
app.get('/health', (_, res) => res.json({
  status: 'ok',
  cookies_active: Boolean(process.env.YOUTUBE_COOKIES || fs.existsSync(path.join(process.cwd(), 'cookies.txt'))),
  ts: Date.now()
}))


// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_, res) => res.status(404).json({ error: 'Not found' }))

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => console.log(`Server running on port ${PORT} [${isProd ? 'production' : 'development'}]`))

process.on('SIGTERM', () => process.exit(0))
process.on('SIGINT',  () => process.exit(0))
process.on('uncaughtException',  (e) => console.error('Uncaught:', e.message))
process.on('unhandledRejection', (e) => console.error('Unhandled:', e))
