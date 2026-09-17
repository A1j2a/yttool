import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, Copy, Tag, AlignLeft, Link2, X, Music, Video } from 'lucide-react'
import { PageWrapper } from '../animations'
import GlassCard from '../components/GlassCard'
import AnimatedButton from '../components/AnimatedButton'
import { useToast } from '../hooks/useToast'
import { useSEO } from '../hooks/useSEO'
import Toast from '../components/Toast'

const TABS = [
  { key: 'transcript', label: 'Script / Transcript', icon: FileText },
  { key: 'description', label: 'Description', icon: AlignLeft },
  { key: 'tags', label: 'Tags', icon: Tag },
]

export default function AIScript() {
  const [url, setUrl] = useState(() => localStorage.getItem('yt_url') || '')
  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const [data, setData] = useState(null)
  const [activeTab, setActiveTab] = useState('transcript')
  const { toasts, addToast, removeToast } = useToast()

  useSEO({
    title: 'YouTube Script & Transcript Extractor - Free Online | YTTune',
    description: 'Extract full YouTube video transcripts, scripts, descriptions, and SEO tags online for free. Convert YouTube video spoken words to text with YTTune.',
    keywords: 'youtube script extractor, youtube transcript download, extract youtube tags, get youtube description, youtube video to text, youtube transcript generator',
    canonical: 'https://yttune.vercel.app/ai-script',
  })

  const handleUrlChange = (val) => {
    setUrl(val)
    setStatus('idle')
    if (val.trim()) {
      localStorage.setItem('yt_url', val.trim())
    } else {
      localStorage.removeItem('yt_url')
    }
  }

  const handleClear = () => {
    setUrl('')
    setStatus('idle')
    localStorage.removeItem('yt_url')
  }

  const handleFetch = async () => {
    const trimmed = url.trim()
    if (!trimmed) { addToast('Please enter a YouTube URL', 'error'); return }
    localStorage.setItem('yt_url', trimmed)
    setStatus('loading')
    setData(null)
    try {
      const API = import.meta.env.VITE_API_URL || ''
      const res = await fetch(`${API}/api/yt-info?url=${encodeURIComponent(trimmed)}`)
      const text = await res.text()
      let json
      try { json = JSON.parse(text) } catch { throw new Error('Server error, please try again') }
      if (json.error) throw new Error(json.error)
      setData(json)
      setStatus('done')
      setActiveTab('transcript')
    } catch (e) {
      addToast(e.message || 'Failed to fetch video info', 'error')
      setStatus('error')
    }
  }

  const copy = (text) => {
    navigator.clipboard.writeText(text)
    addToast('Copied to clipboard!', 'success')
  }

  const activeContent = data
    ? activeTab === 'transcript'
      ? data.transcript
      : activeTab === 'description'
      ? data.description
      : data.tags.join(', ')
    : ''

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-8 sm:py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mx-auto mb-4">
            <Link2 size={28} className="text-pink-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
            YouTube <span className="neon-text">Script Extractor</span>
          </h1>
          <p className="text-slate-500 text-sm sm:text-base">Paste any YouTube URL to get the full transcript, description and tags — free, no signup.</p>
        </motion.div>

        {/* Format Switcher Tabs */}
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex p-1 sm:p-1.5 rounded-2xl glass bg-black/50 border border-white/10 shadow-xl gap-1 sm:gap-2 max-w-full overflow-x-auto no-scrollbar">
            <Link
              to="/mp3"
              className="flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300"
            >
              <Music size={15} className="text-slate-400 flex-shrink-0" />
              <span>MP3 Audio</span>
            </Link>
            <Link
              to="/mp4"
              className="flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300"
            >
              <Video size={15} className="text-slate-400 flex-shrink-0" />
              <span>MP4 Video</span>
            </Link>
            <button
              className="flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 text-white shadow-lg shadow-pink-500/40 ring-1 ring-pink-300/60"
            >
              <FileText size={15} className="text-white flex-shrink-0" />
              <span>AI Script</span>
            </button>
          </div>
        </div>

        {/* URL Input */}
        <GlassCard hover={false} className="p-4 sm:p-5 mb-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <input
                type="url"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full pl-4 pr-10 py-3 rounded-xl glass border border-white/10 text-white placeholder-slate-600 text-sm bg-transparent focus:outline-none"
              />
              {url && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  title="Clear URL"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <AnimatedButton onClick={handleFetch} disabled={status === 'loading'} className="w-full sm:w-auto">
              {status === 'loading' ? 'Fetching...' : 'Extract Content'}
            </AnimatedButton>
          </div>
        </GlassCard>

        {/* Result */}
        {status === 'done' && data && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                    activeTab === key
                      ? 'border-cyan-400/50 bg-cyan-400/10 text-cyan-400'
                      : 'border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon size={14} />
                  {label}
                  {key === 'tags' && data.tags.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-xs">{data.tags.length}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <GlassCard hover={false} className="p-5">
              <div className="flex justify-end mb-3">
                <button
                  onClick={() => copy(activeContent)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass border border-white/10 text-slate-400 hover:text-white text-xs transition-all"
                >
                  <Copy size={12} /> Copy All
                </button>
              </div>

              {activeTab === 'tags' ? (
                <div className="flex flex-wrap gap-2">
                  {data.tags.length > 0
                    ? data.tags.map((tag, i) => (
                        <div key={i} className="flex items-center gap-1 px-3 py-1 rounded-full glass border border-white/10 text-slate-300 text-sm group">
                          <span>{tag}</span>
                          <button
                            onClick={() => copy(tag)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 text-slate-500 hover:text-cyan-400"
                          >
                            <Copy size={10} />
                          </button>
                        </div>
                      ))
                    : <p className="text-slate-500 text-sm">No tags found for this video.</p>
                  }
                </div>
              ) : (
                <div className="bg-black/20 rounded-xl p-4 max-h-[500px] overflow-y-auto">
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {activeContent || <span className="text-slate-500">Not available for this video.</span>}
                  </p>
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}
      </div>
      <Toast toasts={toasts} removeToast={removeToast} />
    </PageWrapper>
  )
}
