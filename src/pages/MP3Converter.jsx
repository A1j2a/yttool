import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Music, Download, CheckCircle, Link as LinkIcon, Play, Pause, Volume2, RotateCcw, Video, X, FileText, Save } from 'lucide-react'
import { PageWrapper } from '../animations'
import AnimatedButton from '../components/AnimatedButton'
import GlassCard from '../components/GlassCard'
import { AUDIO_QUALITIES } from '../constants'
import { useToast } from '../hooks/useToast'
import { useSEO } from '../hooks/useSEO'
import Toast from '../components/Toast'
import FAQAccordion from '../components/FAQAccordion'
import { extractVideoId } from '../utils/urlValidator'
import { API_BASE } from '../config/api'


// ─── Audio Player ─────────────────────────────────────────────────────────────
function AudioPlayer({ blobUrl }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)

  useEffect(() => {
    setPlaying(false)
    setCurrentTime(0)
    setDuration(0)
  }, [blobUrl])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !blobUrl) return
    const onMeta = () => { if (isFinite(audio.duration)) setDuration(audio.duration) }
    const onTime = () => setCurrentTime(audio.currentTime)
    const onEnd  = () => setPlaying(false)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('durationchange', onMeta)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended', onEnd)
    return () => {
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('durationchange', onMeta)
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('ended', onEnd)
    }
  }, [blobUrl])

  const togglePlay = async () => {
    const a = audioRef.current
    if (!a) return
    if (playing) { a.pause(); setPlaying(false) }
    else { await a.play(); setPlaying(true) }
  }

  const seek = (e) => {
    const a = audioRef.current
    if (!a || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    a.currentTime = ((e.clientX - rect.left) / rect.width) * duration
  }

  const changeVolume = (e) => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v
  }

  const fmt = (s) => {
    if (!s || !isFinite(s)) return '0:00'
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
  }

  const pct = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className="mt-5 p-4 rounded-xl bg-black/30 border border-cyan-500/20">
      <audio ref={audioRef} src={blobUrl} preload="auto" />

      {/* Waveform bars */}
      <div className="flex items-end justify-center gap-0.5 h-8 mb-4">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-1 rounded-full"
            style={{ background: playing ? 'linear-gradient(180deg,#00f5ff,#bf00ff)' : '#1e3a4a' }}
            animate={playing ? { height: [4, Math.random() * 26 + 4, 4] } : { height: 4 }}
            transition={{ duration: 0.4 + Math.random() * 0.4, repeat: Infinity, delay: i * 0.03 }}
          />
        ))}
      </div>

      {/* Seek bar */}
      <div className="h-1.5 rounded-full bg-white/10 mb-2 cursor-pointer overflow-hidden" onClick={seek}>
        <div className="h-full rounded-full gradient-bg transition-all" style={{ width: `${pct}%` }} />
      </div>

      {/* Time */}
      <div className="flex justify-between text-xs text-slate-500 mb-4">
        <span>{fmt(currentTime)}</span>
        <span>{fmt(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => { if (audioRef.current) { audioRef.current.currentTime = 0; setCurrentTime(0) } }}
          className="text-slate-500 hover:text-white transition-colors"
        >
          <RotateCcw size={16} />
        </button>

        <button
          onClick={togglePlay}
          className="w-11 h-11 rounded-full gradient-bg flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 hover:scale-105 transition-transform"
        >
          {playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>

        <div className="flex items-center gap-2 flex-1">
          <Volume2 size={14} className="text-slate-500 flex-shrink-0" />
          <input
            type="range" min="0" max="1" step="0.05" value={volume}
            onChange={changeVolume}
            className="flex-1 h-1 accent-cyan-400 cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}

// ─── API ──────────────────────────────────────────────────────────────────────
const API = API_BASE

const MP3_FAQS = [
  {
    q: 'How do I download a YouTube video as an MP3 file?',
    a: 'Copy the URL of the YouTube video, paste it into the converter box above, choose your desired quality (up to 320 kbps), and click "Convert to MP3". When ready, click "Download MP3" to save it directly to your device.',
  },
  {
    q: 'What is the highest audio quality supported for YouTube MP3 download?',
    a: 'YTTune supports converting YouTube videos into MP3 audio up to 320 kbps (studio quality), along with 256 kbps, 192 kbps, and 128 kbps.',
  },
  {
    q: 'Can I download YouTube MP3 on mobile (Android and iPhone)?',
    a: 'Yes! YTTune works natively on mobile Safari, Chrome, Samsung Internet, and Firefox. You can download YouTube MP3 audio directly to your mobile phone storage.',
  },
  {
    q: 'Can I convert YouTube Shorts to MP3 audio?',
    a: 'Yes, our converter fully supports YouTube Shorts links. Simply copy the Shorts link and paste it here to extract the audio track.',
  },
  {
    q: 'Is this YouTube to MP3 converter free?',
    a: 'Yes, 100% free with unlimited conversions. No account signup, subscription, or software installation is required.',
  },
]

async function convertToMp3(videoUrl) {
  const res = await fetch(`${API}/api/mp3?url=${encodeURIComponent(videoUrl)}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Server error ${res.status}`)
  }
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('text/html')) {
    throw new Error('Server returned invalid content. Please check backend connection.')
  }
  const title = decodeURIComponent(res.headers.get('X-Video-Title') || 'Audio Track')
  const thumb = decodeURIComponent(res.headers.get('X-Video-Thumb') || '')
  const blob = await res.blob()
  return { blob, title, thumb }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MP3Converter() {
  const [url, setUrl] = useState(() => localStorage.getItem('yt_url') || '')
  const [quality, setQuality] = useState('192 kbps')
  const [status, setStatus] = useState('idle')   // idle | loading | done | error
  const [result, setResult] = useState(null)
  const [saved, setSaved] = useState(false)
  const { toasts, addToast, removeToast } = useToast()
  const blobRef = useRef(null)

  useSEO({
    title: 'YouTube to MP3 Converter - Free YouTube Video MP3 Download | YTTune',
    description: 'Convert YouTube videos to high quality MP3 audio (320kbps, 256kbps, 192kbps). Free, instant, and unlimited online YouTube MP3 downloader for all devices.',
    keywords: 'youtube video mp3 mp4 download, youtube to mp3, youtube video download, youtube mp3 converter, convert youtube to mp3, free youtube mp3 downloader, download youtube audio',
    canonical: 'https://yttune.vercel.app/mp3',
  })

  useEffect(() => () => { if (blobRef.current) URL.revokeObjectURL(blobRef.current) }, [])

  const isYouTubeUrl = (u) => /^https?:\/\/(www\.)?(youtube\.com\/watch|youtu\.be\/)/.test(u)

  const handleUrlChange = (val) => {
    setUrl(val)
    setStatus('idle')
    setSaved(false)
    if (val.trim()) {
      localStorage.setItem('yt_url', val.trim())
    } else {
      localStorage.removeItem('yt_url')
    }
  }

  const handleClearUrl = () => {
    setUrl('')
    setStatus('idle')
    setSaved(false)
    localStorage.removeItem('yt_url')
  }

  const handleConvert = useCallback(async () => {
    const trimmed = url.trim()
    if (!trimmed) { addToast('Please enter a video URL', 'error'); return }
    if (!isYouTubeUrl(trimmed)) { addToast('Please enter a valid YouTube URL', 'error'); return }

    if (blobRef.current) { URL.revokeObjectURL(blobRef.current); blobRef.current = null }
    setStatus('loading')
    setResult(null)
    setSaved(false)

    try {
      const { blob, title, thumb } = await convertToMp3(trimmed)
      const blobUrl = URL.createObjectURL(blob)
      blobRef.current = blobUrl
      const filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`
      setResult({ blobUrl, title, thumb, filename })
      setStatus('done')

      // Automatically download directly to user's device
      try {
        const a = document.createElement('a')
        a.href = blobUrl
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        setSaved(true)
        addToast('Downloaded directly to your device!', 'success')
      } catch {
        // In case browser restricts automatic popup
      }
    } catch (err) {
      setStatus('error')
      addToast(err.message || 'Conversion failed. Try again.', 'error')
    }
  }, [url])

  const handleDownload = () => {
    if (!result?.blobUrl) return
    const a = document.createElement('a')
    a.href = result.blobUrl
    a.download = result.filename || 'audio.mp3'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setSaved(true)
    addToast('Saved to your device!', 'success')
  }

  const videoId = extractVideoId(url)
  const thumbUrl = result?.thumb || (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null)

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-3 sm:px-6 py-8 sm:py-16">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4">
            <Music size={28} className="text-cyan-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Video to <span className="neon-text">MP3</span>
          </h1>
          <p className="text-slate-500 text-sm sm:text-base">Extract high-quality audio from any YouTube video — 100% free, no signup.</p>
        </motion.div>

        {/* Format Switcher Tabs */}
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex p-1 sm:p-1.5 rounded-2xl glass bg-black/50 border border-white/10 shadow-xl gap-1 sm:gap-2 max-w-full overflow-x-auto no-scrollbar">
            <button
              className="flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/40 ring-1 ring-cyan-300/60"
            >
              <Music size={15} className="text-white flex-shrink-0" />
              <span>MP3 Audio</span>
            </button>
            <Link
              to="/mp4"
              className="flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300"
            >
              <Video size={15} className="text-slate-400 flex-shrink-0" />
              <span>MP4 Video</span>
            </Link>
            <Link
              to="/ai-script"
              className="flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300"
            >
              <FileText size={15} className="text-slate-400 flex-shrink-0" />
              <span>AI Script</span>
            </Link>
          </div>
        </div>

        {/* Input Card */}
        <GlassCard hover={false} className="p-6 mb-6">
          <label className="block text-slate-400 text-sm font-medium mb-2">YouTube URL</label>
          <div className="relative mb-5">
            <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="url"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full pl-9 pr-10 py-3 rounded-xl glass border border-white/10 text-white placeholder-slate-600 text-sm bg-transparent focus:outline-none"
            />
            {url && (
              <button
                type="button"
                onClick={handleClearUrl}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                title="Clear URL"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Thumbnail preview */}
          {thumbUrl && status === 'idle' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-5 rounded-xl overflow-hidden"
            >
              <img src={thumbUrl} alt="preview" className="w-full h-36 object-cover" />
            </motion.div>
          )}

          <label className="block text-slate-400 text-sm font-medium mb-3">Audio Quality</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            {AUDIO_QUALITIES.map((q) => (
              <button
                key={q}
                onClick={() => !q.includes('Pro') && setQuality(q)}
                className={`py-2.5 rounded-xl text-sm font-medium transition-all border ${
                  quality === q
                    ? 'border-cyan-400/50 bg-cyan-400/10 text-cyan-400'
                    : q.includes('Pro')
                    ? 'border-white/5 text-slate-600 cursor-not-allowed'
                    : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                }`}
              >
                {q}
                {q.includes('Pro') && <span className="block text-xs text-purple-400">Upgrade</span>}
              </button>
            ))}
          </div>

          <AnimatedButton onClick={handleConvert} disabled={status === 'loading'} className="w-full">
            <Music size={16} />
            {status === 'loading' ? 'Converting...' : 'Convert to MP3'}
          </AnimatedButton>
        </GlassCard>

        {/* Loading */}
        {status === 'loading' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin flex-shrink-0" />
              <div>
                <p className="text-white text-sm font-medium">Converting to MP3...</p>
                <p className="text-slate-400 text-xs mt-0.5">Please wait, processing audio from YouTube</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-cyan-400 text-xs font-medium bg-cyan-500/10 px-3 py-2 rounded-xl">
              <Download size={14} className="animate-bounce flex-shrink-0" />
              <span>Conversion complete hote hi audio file aapki device me automatically download ho jayegi.</span>
            </div>
          </motion.div>
        )}

        {/* Result */}
        {status === 'done' && result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-6 border border-green-500/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle size={20} className="text-green-400" />
              <span className="text-green-400 font-semibold">Ready to Save</span>
            </div>

            <div className="flex items-center gap-4 mb-2">
              {thumbUrl ? (
                <img src={thumbUrl} alt="thumbnail" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Music size={24} className="text-cyan-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{result.title}</p>
                <p className="text-slate-500 text-xs mt-1">{quality} • MP3</p>
              </div>
            </div>

            <AudioPlayer blobUrl={result.blobUrl} />

            <AnimatedButton
              className={`w-full mt-4 flex items-center justify-center gap-2 ${
                saved
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
              }`}
              onClick={handleDownload}
            >
              {saved ? (
                <>
                  <CheckCircle size={18} />
                  Saved to Device
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save MP3 to Device
                </>
              )}
            </AnimatedButton>
          </motion.div>
        )}

        {/* Error */}
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-5 border border-red-500/20 text-center"
          >
            <p className="text-red-400 font-medium mb-1">Conversion failed</p>
            <p className="text-slate-500 text-sm mb-4">Video unavailable or age-restricted. Try another video.</p>
            <button onClick={() => setStatus('idle')} className="text-cyan-400 text-sm hover:underline">
              Try again
            </button>
          </motion.div>
        )}

        {/* Semantic SEO Content Section */}
        <section className="mt-16 pt-12 border-t border-white/5 space-y-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              YouTube Video MP3 Download — High Quality 320kbps Audio Converter
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4 text-sm sm:text-base">
              YTTune provides the fastest and most reliable online tool for <strong className="text-white">YouTube video MP3 download</strong>. Extract crystal-clear music, podcast episodes, lectures, audiobooks, and background tracks from YouTube videos in pure MP3 format. With support for bitrates up to 320kbps, enjoy true studio quality sound without loss of fidelity.
            </p>
            <p className="text-slate-400 leading-relaxed text-sm">
              Our free cloud converter handles everything on fast dedicated servers. There are no software downloads required, no annoying browser extensions to install, and zero restrictions on video length.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="glass rounded-xl p-5 border border-white/10">
              <h3 className="text-white font-bold mb-2">⚡ Ultra-Fast Conversion</h3>
              <p className="text-slate-400 text-xs leading-relaxed">High-speed cloud processing converts YouTube videos to MP3 in mere seconds.</p>
            </div>
            <div className="glass rounded-xl p-5 border border-white/10">
              <h3 className="text-white font-bold mb-2">🎧 Up to 320 kbps HD Audio</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Choose from 128kbps, 192kbps, 256kbps, and maximum fidelity 320kbps MP3.</p>
            </div>
            <div className="glass rounded-xl p-5 border border-white/10">
              <h3 className="text-white font-bold mb-2">📱 All Devices Supported</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Seamlessly download on iPhone, Android, Mac, Windows, Linux, and tablets.</p>
            </div>
          </div>

          {/* How to Guide */}
          <div className="glass rounded-2xl p-6 sm:p-8 border border-white/10 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              How to Download YouTube Videos to MP3 Online
            </h2>
            <ol className="list-decimal list-inside space-y-3 text-slate-300 text-sm">
              <li><strong className="text-white">Copy Link:</strong> Go to YouTube and copy the URL of the video you want to convert.</li>
              <li><strong className="text-white">Paste URL:</strong> Paste the URL into the input field above.</li>
              <li><strong className="text-white">Select Bitrate:</strong> Choose your preferred audio quality (192 kbps or 320 kbps).</li>
              <li><strong className="text-white">Convert & Save:</strong> Click &quot;Convert to MP3&quot;, preview the audio, and click &quot;Download MP3&quot;.</li>
            </ol>
          </div>

          {/* MP3 FAQs */}
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              YouTube Video MP3 Download — FAQs
            </h2>
            <FAQAccordion faqs={MP3_FAQS} />
          </div>
        </section>

      </div>
      <Toast toasts={toasts} removeToast={removeToast} />
    </PageWrapper>
  )
}
