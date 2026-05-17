import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Copy, Download, Clock, Trash2, ChevronRight } from 'lucide-react'
import { PageWrapper } from '../animations'
import AnimatedButton from '../components/AnimatedButton'
import GlassCard from '../components/GlassCard'
import { AI_TONES, AI_TYPES } from '../constants'
import { useToast } from '../hooks/useToast'
import Toast from '../components/Toast'

const MOCK_SCRIPTS = [
  {
    id: 1,
    topic: 'Morning routine for productivity',
    type: 'YouTube Script',
    preview: '🎬 Hook: "Most people waste the first hour of their day. Here\'s what the top 1% do instead..." The morning sets the tone for everything that follows...',
  },
  {
    id: 2,
    topic: 'Best budget travel tips',
    type: 'Blog Post',
    preview: '✈️ Traveling on a budget doesn\'t mean sacrificing experiences. In this guide, we\'ll reveal 10 insider secrets that seasoned travelers use...',
  },
]

export default function AIScript() {
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('Professional')
  const [type, setType] = useState('YouTube Script')
  const [status, setStatus] = useState('idle')
  const [output, setOutput] = useState('')
  const [history, setHistory] = useState(MOCK_SCRIPTS)
  const { toasts, addToast, removeToast } = useToast()

  const MOCK_OUTPUT = `🎬 **${type}: ${topic || 'Your Topic'}**

**HOOK (0-5 seconds)**
"${topic ? `What if I told you that ${topic} could completely transform your life in just 30 days?` : 'Start with a powerful hook that grabs attention immediately...'}"

**INTRO (5-30 seconds)**
Welcome back to the channel! Today we're diving deep into ${topic || 'this incredible topic'} — and by the end of this video, you'll have a complete roadmap to get started.

**MAIN CONTENT**

Point 1: The Foundation
Before anything else, you need to understand the core principles. Most people skip this step and wonder why they're not seeing results...

Point 2: The Strategy
Here's the exact framework I use: [Step-by-step breakdown with actionable tips and real examples]

Point 3: Common Mistakes to Avoid
I've seen thousands of people make these exact mistakes. Don't be one of them...

**CALL TO ACTION**
If this video helped you, smash that like button and subscribe for more content like this. Drop a comment below with your biggest takeaway!

**OUTRO**
See you in the next one. Peace! ✌️`

  const handleGenerate = () => {
    if (!topic.trim()) { addToast('Please enter a topic', 'error'); return }
    setStatus('loading')
    setOutput('')
    let i = 0
    const chars = MOCK_OUTPUT.split('')
    const interval = setInterval(() => {
      if (i >= chars.length) {
        clearInterval(interval)
        setStatus('done')
        setHistory((prev) => [{ id: Date.now(), topic, type, preview: MOCK_OUTPUT.slice(0, 120) + '...' }, ...prev])
        return
      }
      setOutput((prev) => prev + chars[i])
      i += 3
    }, 20)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    addToast('Script copied to clipboard!', 'success')
  }

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mx-auto mb-4">
            <Sparkles size={28} className="text-pink-400" />
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            AI Script <span className="neon-text">Generator</span>
          </h1>
          <p className="text-slate-500">Generate professional scripts, blog posts, and ad copy with AI.</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-4">
            <GlassCard hover={false} className="p-5">
              <h3 className="text-white font-semibold mb-4">Configure</h3>

              <label className="block text-slate-400 text-xs font-medium mb-2">Content Type</label>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {AI_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium transition-all border ${
                      type === t ? 'border-pink-400/50 bg-pink-400/10 text-pink-400' : 'border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <label className="block text-slate-400 text-xs font-medium mb-2">Tone</label>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {AI_TONES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium transition-all border ${
                      tone === t ? 'border-cyan-400/50 bg-cyan-400/10 text-cyan-400' : 'border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <label className="block text-slate-400 text-xs font-medium mb-2">Topic / Prompt</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. 10 productivity hacks for remote workers..."
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl glass border border-white/10 text-white placeholder-slate-600 text-sm bg-transparent resize-none mb-4"
              />

              <AnimatedButton onClick={handleGenerate} disabled={status === 'loading'} className="w-full">
                <Sparkles size={15} />
                {status === 'loading' ? 'Generating...' : 'Generate Script'}
              </AnimatedButton>
            </GlassCard>

            {/* History */}
            <GlassCard hover={false} className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={16} className="text-slate-400" />
                <h3 className="text-white font-semibold text-sm">History</h3>
              </div>
              <div className="space-y-3">
                {history.map((item) => (
                  <div key={item.id} className="glass rounded-xl p-3 group cursor-pointer hover:border-white/20 transition-all">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium truncate">{item.topic}</p>
                        <p className="text-slate-500 text-xs">{item.type}</p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-1 text-slate-500 hover:text-red-400" onClick={() => setHistory((h) => h.filter((x) => x.id !== item.id))}>
                          <Trash2 size={12} />
                        </button>
                        <button className="p-1 text-slate-500 hover:text-cyan-400">
                          <ChevronRight size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Output Panel */}
          <div className="lg:col-span-2">
            <GlassCard hover={false} className="p-5 h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Generated Script</h3>
                {output && (
                  <div className="flex gap-2">
                    <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass border border-white/10 text-slate-400 hover:text-white text-xs transition-all">
                      <Copy size={12} /> Copy
                    </button>
                    <button onClick={() => addToast('Script downloaded!', 'success')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass border border-white/10 text-slate-400 hover:text-white text-xs transition-all">
                      <Download size={12} /> Download
                    </button>
                  </div>
                )}
              </div>

              {!output && status === 'idle' && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Sparkles size={40} className="text-slate-700 mb-4" />
                  <p className="text-slate-600">Your generated script will appear here</p>
                  <p className="text-slate-700 text-sm mt-1">Configure your settings and click Generate</p>
                </div>
              )}

              {output && (
                <div className="bg-black/20 rounded-xl p-4 h-96 overflow-y-auto">
                  <pre className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">{output}
                    {status === 'loading' && <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse" />}
                  </pre>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
      <Toast toasts={toasts} removeToast={removeToast} />
    </PageWrapper>
  )
}
