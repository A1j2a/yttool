import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

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

// ── Start conversion ──────────────────────────────────────────────────────────
app.get('/api/convert', async (req, res) => {
  const { url, format = 'mp3' } = req.query
  if (!url) return res.status(400).json({ error: 'url required' })
  if (!isValidYouTubeUrl(decodeURIComponent(url)))
    return res.status(400).json({ error: 'Invalid YouTube URL' })
  try {
    const params = new URLSearchParams({ start: 1, end: 1, format, url })
    const r = await fetch(`https://loader.to/ajax/download.php?${params}`, { signal: AbortSignal.timeout(15000) })
    const data = await r.json()
    res.json(data)
  } catch (e) {
    res.status(502).json({ error: 'Conversion service unavailable' })
  }
})

// ── Poll progress ─────────────────────────────────────────────────────────────
app.get('/api/progress', async (req, res) => {
  const { id } = req.query
  if (!id || !/^[\w-]{10,30}$/.test(id)) return res.status(400).json({ error: 'invalid id' })
  try {
    const r = await fetch(`https://p.savenow.to/api/progress?id=${id}`, { signal: AbortSignal.timeout(10000) })
    const data = await r.json()
    res.json(data)
  } catch (e) {
    res.status(502).json({ error: 'Progress service unavailable' })
  }
})

// ── Stream MP3 proxy ──────────────────────────────────────────────────────────
app.get('/api/stream', async (req, res) => {
  const { url } = req.query
  if (!url) return res.status(400).json({ error: 'url required' })
  const decoded = decodeURIComponent(url)
  if (!decoded.startsWith('https://')) return res.status(400).json({ error: 'invalid url' })
  try {
    const r = await fetch(decoded, { signal: AbortSignal.timeout(30000) })
    if (!r.ok) return res.status(502).json({ error: 'upstream error' })
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Cache-Control', 'no-store')
    r.body.pipe(res)
  } catch (e) {
    if (!res.headersSent) res.status(502).json({ error: 'Stream failed' })
  }
})

// ── YouTube info (transcript + description + tags) ────────────────────────────
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
