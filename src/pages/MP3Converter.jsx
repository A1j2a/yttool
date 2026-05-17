import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Music, Download, CheckCircle, Link as LinkIcon, Play, Pause, Volume2, RotateCcw } from 'lucide-react'
import { PageWrapper } from '../animations'
import AnimatedButton from '../components/AnimatedButton'
import GlassCard from '../components/GlassCard'
import { AUDIO_QUALITIES } from '../constants'
import { useToast } from '../hooks/useToast'
import Toast from '../components/Toast'

// ─── Audio Player ─────────────────────────────────────────────────────────────
function AudioPlayer({ src }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setCurrentTime(audio.currentTime)
    const onMeta = () => setDuration(audio.duration)
    const onEnd  = () => setPlaying(false)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('ended', onEnd)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('ended', onEnd)
    }
  }, [src])

  const togglePlay = () => {
    const a = audioRef.current
    if (!a) return
    if (playing) { a.pause(); setPlaying(false) }
    else { a.play(); setPlaying(true) }
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
    if (!s || isNaN(s)) return '0:00'
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
  }

  const pct = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className="mt-5 p-4 rounded-xl bg-black/30 border border-cyan-500/20">
      <audio ref={audioRef} src={src} preload="metadata" crossOrigin="anonymous" />

      {/* Animated waveform bars */}
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
const LOADER_START = 'https://loader.to/ajax/download.php'
const LOADER_PROGRESS = 'https://p.savenow.to/api/progress'

function extractVideoId(url) {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}

async function startConversion(url) {
  const params = new URLSearchParams({ start: 1, end: 1, format: 'mp3', url })
  const res = await fetch(`${LOADER_START}?${params}`)
  if (!res.ok) throw new Error('Failed to start conversion')
  const data = await res.json()
  if (!data.success || !data.id) throw new Error('Invalid response from converter')
  return { id: data.id, title: data.title || 'Audio Track', thumb: data.info?.image || null }
}

async function pollProgress(id, onProgress) {
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 2000))
    const res = await fetch(`${LOADER_PROGRESS}?id=${id}`)
    const data = await res.json()
    const pct = Math.min(Math.round((data.progress / 1000) * 100), 99)
    onProgress(pct)
    if (data.success === 1 && data.download_url) return data.download_url
  }
  throw new Error('Conversion timed out')
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MP3Converter() {
  const [url, setUrl] = useState('')
  const [quality, setQuality] = useState('192 kbps')
  const [status, setStatus] = useState('idle')   // idle | loading | done | error
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)      // { title, thumb, downloadUrl }
  const { toasts, addToast, removeToast } = useToast()

  const handleConvert = async () => {
    if (!url.trim()) { addToast('Please enter a valid URL', 'error'); return }
    setStatus('loading')
    setProgress(5)
    setResult(null)

    try {
      const { id, title, thumb } = await startConversion(url.trim())
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
    a.download = `${result.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    addToast('Download started!', 'success')
  }

  const videoId = extractVideoId(url)
  const thumbUrl = result?.thumb || (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null)

  const STEPS = ['Fetching URL', 'Extracting audio', 'Encoding MP3', 'Preparing download']

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4">
            <Music size={28} className="text-cyan-400" />
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            Video to <span className="neon-text">MP3</span>
          </h1>
          <p className="text-slate-500">Extract high-quality audio from any video URL instantly.</p>
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

        {/* Progress */}
        {status === 'loading' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white text-sm font-medium">Converting audio...</span>
              <span className="text-cyan-400 text-sm font-bold">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full gradient-bg"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
              {STEPS.map((step, i) => (
                <span
                  key={step}
                  className={`text-xs transition-colors ${progress > i * 24 ? 'text-cyan-400' : 'text-slate-600'}`}
                >
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
            className="glass rounded-2xl p-6 border border-green-500/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle size={20} className="text-green-400" />
              <span className="text-green-400 font-semibold">Conversion Complete!</span>
            </div>

            {/* Track info */}
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

            {/* Audio Player */}
            <AudioPlayer src={result.downloadUrl} />

            {/* Download */}
            <AnimatedButton className="w-full mt-4" onClick={handleDownload}>
              <Download size={16} />
              Download MP3
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
            <p className="text-slate-500 text-sm mb-4">
              The URL may be unsupported or the service is temporarily unavailable. Try again or use a different URL.
            </p>
            <button onClick={() => setStatus('idle')} className="text-cyan-400 text-sm hover:underline">
              Try again
            </button>
          </motion.div>
        )}

      </div>
      <Toast toasts={toasts} removeToast={removeToast} />
    </PageWrapper>
  )
}
