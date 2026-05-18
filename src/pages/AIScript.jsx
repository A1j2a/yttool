import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Copy, Tag, AlignLeft, Link2 } from 'lucide-react'
import { PageWrapper } from '../animations'
import GlassCard from '../components/GlassCard'
import AnimatedButton from '../components/AnimatedButton'
import { useToast } from '../hooks/useToast'
import Toast from '../components/Toast'

const TABS = [
  { key: 'transcript', label: 'Script / Transcript', icon: FileText },
  { key: 'description', label: 'Description', icon: AlignLeft },
  { key: 'tags', label: 'Tags', icon: Tag },
]

export default function AIScript() {
  const [url, setUrl] = useState(() => {
    const saved = localStorage.getItem('yt_url')
    if (saved) { localStorage.removeItem('yt_url'); return saved }
    return ''
  })
  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const [data, setData] = useState(null)
  const [activeTab, setActiveTab] = useState('transcript')
  const { toasts, addToast, removeToast } = useToast()

  const handleFetch = async () => {
    if (!url.trim()) { addToast('Please enter a YouTube URL', 'error'); return }
    setStatus('loading')
    setData(null)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/yt-info?url=${encodeURIComponent(url)}`)
      const text = await res.text()
      let json
      try { json = JSON.parse(text) } catch { throw new Error('Server nahi chal raha — pehle: npm run server') }
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mx-auto mb-4">
            <Link2 size={28} className="text-pink-400" />
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            YouTube <span className="neon-text">Script Extractor</span>
          </h1>
          <p className="text-slate-500">Paste any YouTube URL to get the full transcript, description and tags — free, no signup.</p>
        </motion.div>

        {/* URL Input */}
        <GlassCard hover={false} className="p-5 mb-6">
          <div className="flex gap-3">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-slate-600 text-sm bg-transparent"
            />
            <AnimatedButton onClick={handleFetch} disabled={status === 'loading'}>
              {status === 'loading' ? 'Fetching...' : 'Extract'}
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
