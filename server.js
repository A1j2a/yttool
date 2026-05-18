import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3001

app.use(cors({ origin: '*' }))

// Start conversion
app.get('/api/convert', async (req, res) => {
  const { url } = req.query
  if (!url) return res.status(400).json({ error: 'url required' })
  try {
    const params = new URLSearchParams({ start: 1, end: 1, format: 'mp3', url })
    const r = await fetch(`https://loader.to/ajax/download.php?${params}`)
    const data = await r.json()
    res.json(data)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// Poll progress
app.get('/api/progress', async (req, res) => {
  const { id } = req.query
  if (!id) return res.status(400).json({ error: 'id required' })
  try {
    const r = await fetch(`https://p.savenow.to/api/progress?id=${id}`)
    const data = await r.json()
    res.json(data)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// Stream MP3 as blob (proxy to avoid CORS on audio)
app.get('/api/stream', async (req, res) => {
  const { url } = req.query
  if (!url) return res.status(400).json({ error: 'url required' })
  try {
    const r = await fetch(decodeURIComponent(url))
    if (!r.ok) return res.status(502).json({ error: 'upstream error' })
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Access-Control-Allow-Origin', '*')
    r.body.pipe(res)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// Fetch YouTube transcript via timedtext API
async function fetchTranscript(videoId) {
  try {
    const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    })
    const html = await pageRes.text()

    // Extract caption tracks from ytInitialPlayerResponse
    const match = html.match(/"captionTracks":\s*(\[.*?\])/)
    if (!match) return 'Transcript not available for this video.'

    const tracks = JSON.parse(match[1])
    const track = tracks.find(t => t.languageCode === 'en') || tracks[0]
    if (!track) return 'Transcript not available for this video.'

    const xmlRes = await fetch(track.baseUrl)
    const xml = await xmlRes.text()
    const texts = [...xml.matchAll(/<text[^>]*>([^<]*)<\/text>/g)]
    return texts.map(m => m[1].replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>')).join(' ')
  } catch {
    return 'Transcript not available for this video.'
  }
}

// YouTube video info: transcript + description + tags
app.get('/api/yt-info', async (req, res) => {
  const { url } = req.query
  if (!url) return res.status(400).json({ error: 'url required' })

  // Extract video ID
  const match = url.match(/(?:v=|youtu\.be\/)([\w-]{11})/)
  if (!match) return res.status(400).json({ error: 'Invalid YouTube URL' })
  const videoId = match[1]

  try {
    const transcript = await fetchTranscript(videoId)

    let description = ''
    let tags = []
    try {
      const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      })
      const html = await pageRes.text()

      // Full description from ytInitialData
      const dataMatch = html.match(/var ytInitialData = (.*?);<\/script>/s)
      if (dataMatch) {
        try {
          const ytData = JSON.parse(dataMatch[1])
          const videoDetails = ytData?.contents?.twoColumnWatchNextResults?.results?.results?.contents
          if (videoDetails) {
            for (const item of videoDetails) {
              const desc = item?.videoSecondaryInfoRenderer?.attributedDescription?.content
              if (desc) { description = desc; break }
            }
          }
        } catch { /* ignore */ }
      }

      // Fallback to meta description
      if (!description) {
        const descMatch = html.match(/<meta name="description" content="([^"]+)"/)
        if (descMatch) description = descMatch[1]
      }

      // Tags from meta keywords
      const tagMatch = html.match(/<meta name="keywords" content="([^"]+)"/)
      if (tagMatch) tags = tagMatch[1].split(',').map(t => t.trim()).filter(Boolean)
    } catch { /* ignore */ }

    res.json({ videoId, transcript, description, tags })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.listen(PORT, () => console.log(`Proxy running on http://localhost:${PORT}`))

process.on('SIGTERM', () => process.exit(0))
process.on('SIGINT', () => process.exit(0))
