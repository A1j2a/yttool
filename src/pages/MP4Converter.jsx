import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Video, Download, CheckCircle, Link as LinkIcon, Play, Pause, Volume2, Maximize, RotateCcw } from 'lucide-react'
import { PageWrapper } from '../animations'
import AnimatedButton from '../components/AnimatedButton'
import GlassCard from '../components/GlassCard'
import { useToast } from '../hooks/useToast'
import Toast from '../components/Toast'
import { isValidVideoUrl, extractVideoId } from '../utils/urlValidator'

// ─── Resolution config ────────────────────────────────────────────────────────
const RESOLUTIONS = [
  { label: '360p',       format: '360',  pro: false },
  { label: '480p',       format: '480',  pro: false },
  { label: '720p HD',    format: '720',  pro: false },
  { label: '1080p FHD',  format: '1080', pro: false },
  { label: '4K UHD',     format: '2160', pro: true  },
]

// ─── Video Player ─────────────────────────────────────────────────────────────
function VideoPlayer({ src, title, thumb }) {
  const videoRef = useRef(null)
  const [playing, setPlaying]       = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration]     = useState(0)
  const [volume, setVolume]         = useState(1)
  const [showControls, setShowControls] = useState(true)
  const hideTimer = useRef(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onTime = () => setCurrentTime(v.currentTime)
    const onMeta = () => setDuration(v.duration)
    const onEnd  = () => setPlaying(false)
    v.addEventListener('timeupdate', onTime)
    v.addEventListener('loadedmetadata', onMeta)
    v.addEventListener('ended', onEnd)
    return () => {
      v.removeEventListener('timeupdate', onTime)
      v.removeEventListener('loadedmetadata', onMeta)
      v.removeEventListener('ended', onEnd)
    }
  }, [src])

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (playing) { v.pause(); setPlaying(false) }
    else { v.play(); setPlaying(true) }
  }

  const seek = (e) => {
    const v = videoRef.current
    if (!v || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    v.currentTime = ((e.clientX - rect.left) / rect.width) * duration
  }

  const changeVolume = (e) => {
    const val = parseFloat(e.target.value)
    setVolume(val)
    if (videoRef.current) videoRef.current.volume = val
  }

  const fullscreen = () => {
    const v = videoRef.current
    if (!v) return
    if (v.requestFullscreen) v.requestFullscreen()
    else if (v.webkitRequestFullscreen) v.webkitRequestFullscreen()
  }

  const restart = () => {
    const v = videoRef.current
    if (!v) return
    v.currentTime = 0
    setCurrentTime(0)
  }

  const handleMouseMove = () => {
    setShowControls(true)
    clearTimeout(hideTimer.current)
    if (playing) hideTimer.current = setTimeout(() => setShowControls(false), 2500)
  }

  const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00'
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
  }

  const pct = duration ? (currentTime / duration) * 100 : 0

  return (
    <div
      className="relative rounded-xl overflow-hidden bg-black group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={thumb}
        className="w-full max-h-72 object-contain bg-black"
        onClick={togglePlay}
        preload="metadata"
      />

      {/* Big play overlay when paused */}
      {!playing && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={togglePlay}
        >
          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all">
            <Play size={26} className="text-white ml-1" />
          </div>
        </div>
      )}

      {/* Controls bar */}
      <motion.div
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-4 pt-8 pb-3"
      >
        {/* Seek bar */}
        <div
          className="h-1 rounded-full bg-white/20 mb-3 cursor-pointer overflow-hidden"
          onClick={seek}
        >
          <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all" style={{ width: `${pct}%` }} />
        </div>

        <div className="flex items-center gap-3">
          {/* Restart */}
          <button onClick={restart} className="text-white/60 hover:text-white transition-colors">
            <RotateCcw size={14} />
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            {playing ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
          </button>

          {/* Time */}
          <span className="text-white/60 text-xs tabular-nums">{fmt(currentTime)} / {fmt(duration)}</span>

          <div className="flex-1" />

          {/* Volume */}
          <div className="flex items-center gap-1.5">
            <Volume2 size={13} className="text-white/60" />
            <input
              type="range" min="0" max="1" step="0.05" value={volume}
              onChange={changeVolume}
              className="w-16 h-1 accent-purple-400 cursor-pointer"
            />
          </div>

          {/* Fullscreen */}
          <button onClick={fullscreen} className="text-white/60 hover:text-white transition-colors">
            <Maximize size={14} />
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const LOADER_START    = import.meta.env.VITE_LOADER_START
const LOADER_PROGRESS = import.meta.env.VITE_LOADER_PROGRESS

async function startConversion(url, format) {
  const params = new URLSearchParams({ start: 1, end: 1, format, url })
  const res = await fetch(`${LOADER_START}?${params}`)
  if (!res.ok) throw new Error('Failed to start conversion')
  const data = await res.json()
  if (!data.success || !data.id) throw new Error(data.message || 'Conversion failed')
  return {
    id:    data.id,
    title: data.title || 'Video',
    thumb: data.info?.image || null,
  }
}

async function pollProgress(id, onProgress) {
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 2000))
    const res  = await fetch(`${LOADER_PROGRESS}?id=${id}`)
    const data = await res.json()
    onProgress(Math.min(Math.round((data.progress / 1000) * 100), 99))
    if (data.success === 1 && data.download_url) return data.download_url
  }
  throw new Error('Conversion timed out')
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MP4Converter() {
  const [url, setUrl]             = useState('')
  const [resolution, setResolution] = useState(RESOLUTIONS[2]) // 720p default
  const [status, setStatus]       = useState('idle')
  const [progress, setProgress]   = useState(0)
  const [result, setResult]       = useState(null)
  const { toasts, addToast, removeToast } = useToast()

  const handleConvert = async () => {
    if (!url.trim() || !isValidVideoUrl(url.trim())) { addToast('Please enter a valid YouTube or supported video URL', 'error'); return }
    setStatus('loading')
    setProgress(5)
    setResult(null)

    try {
      const { id, title, thumb } = await startConversion(url.trim(), resolution.format)
      setProgress(15)

      const downloadUrl = await pollProgress(id, (pct) => setProgress(15 + pct * 0.84))

      setProgress(100)
      setResult({ title, thumb, downloadUrl })
      setStatus('done')
    } catch (err) {
      setStatus('error')
      addToast(err.message || 'Conversion failed', 'error')
    }
  }

  const handleDownload = () => {
    if (!result?.downloadUrl) return
    const a = document.createElement('a')
    a.href = result.downloadUrl
    a.download = `${(result.title || 'video').replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${resolution.label}.mp4`
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    addToast('Download started!', 'success')
  }

  const videoId  = extractVideoId(url)
  const thumbUrl = result?.thumb || (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null)

  const STEPS = ['Fetching URL', 'Processing video', 'Encoding MP4', 'Preparing download']

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4">
            <Video size={28} className="text-purple-400" />
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            Video to <span className="neon-text">MP4</span>
          </h1>
          <p className="text-slate-500">Download videos in HD quality — free, no watermark, no signup.</p>
        </motion.div>

        {/* Input Card */}
        <GlassCard hover={false} className="p-6 mb-6">
          <label className="block text-slate-400 text-sm font-medium mb-2">Video URL</label>
          <div className="relative mb-5">
            <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="url"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setStatus('idle') }}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full pl-9 pr-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-slate-600 text-sm bg-transparent"
            />
          </div>

          {/* Thumbnail preview while typing */}
          {thumbUrl && status === 'idle' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-5 rounded-xl overflow-hidden relative"
            >
              <img src={thumbUrl} alt="preview" className="w-full h-40 object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
                  <Play size={20} className="text-white ml-0.5" />
                </div>
              </div>
            </motion.div>
          )}

          <label className="block text-slate-400 text-sm font-medium mb-3">Resolution</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
            {RESOLUTIONS.map((r) => (
              <button
                key={r.label}
                onClick={() => !r.pro && setResolution(r)}
                className={`py-2.5 rounded-xl text-sm font-medium transition-all border ${
                  resolution.label === r.label
                    ? 'border-purple-400/50 bg-purple-400/10 text-purple-400'
                    : r.pro
                    ? 'border-white/5 text-slate-600 cursor-not-allowed'
                    : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                }`}
              >
                {r.label}
                {r.pro && <span className="block text-xs text-purple-400">Pro</span>}
              </button>
            ))}
          </div>

          <AnimatedButton onClick={handleConvert} disabled={status === 'loading'} className="w-full">
            <Video size={16} />
            {status === 'loading' ? 'Processing...' : 'Download MP4'}
          </AnimatedButton>
        </GlassCard>

        {/* Progress */}
        {status === 'loading' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white text-sm font-medium">Processing video...</span>
              <span className="text-purple-400 text-sm font-bold">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
              {STEPS.map((step, i) => (
                <span key={step} className={`text-xs transition-colors ${progress > i * 24 ? 'text-purple-400' : 'text-slate-600'}`}>
                  {step}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Result */}
        {status === 'done' && result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl overflow-hidden border border-purple-500/20"
          >
            {/* Video Player */}
            <VideoPlayer src={result.downloadUrl} title={result.title} thumb={thumbUrl} />

            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle size={18} className="text-green-400" />
                <span className="text-green-400 font-semibold text-sm">Ready to Download</span>
                <span className="ml-auto px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs font-bold">
                  {resolution.label}
                </span>
              </div>
              <p className="text-white font-medium text-sm truncate mb-1">{result.title}</p>
              <p className="text-slate-500 text-xs mb-4">MP4 • {resolution.label}</p>

              <AnimatedButton className="w-full" onClick={handleDownload}>
                <Download size={16} />
                Download MP4
              </AnimatedButton>
            </div>
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
            <p className="text-slate-500 text-sm mb-4">
              The URL may be unsupported or the service is temporarily unavailable. Try again or use a different URL.
            </p>
            <button onClick={() => setStatus('idle')} className="text-purple-400 text-sm hover:underline">
              Try again
            </button>
          </motion.div>
        )}

      </div>
      <Toast toasts={toasts} removeToast={removeToast} />
    </PageWrapper>
  )
}
