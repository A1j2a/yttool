import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Download, Sparkles, Star, Music, Video, X } from 'lucide-react'
import { PageWrapper } from '../animations'
import ToolCard from '../components/ToolCard'
import FeatureCard from '../components/FeatureCard'
import FAQAccordion from '../components/FAQAccordion'
import AnimatedButton from '../components/AnimatedButton'
import { TOOLS, FEATURES, STATS, TESTIMONIALS, FAQS } from '../constants'
import { useSEO } from '../hooks/useSEO'

export default function Landing() {
  const [url, setUrl] = useState(() => localStorage.getItem('yt_url') || '')
  const [format, setFormat] = useState('mp3') // 'mp3' | 'mp4'
  const navigate = useNavigate()

  const handleUrlChange = (val) => {
    setUrl(val)
    if (val.trim()) {
      localStorage.setItem('yt_url', val.trim())
    } else {
      localStorage.removeItem('yt_url')
    }
  }

  const handleClear = () => {
    setUrl('')
    localStorage.removeItem('yt_url')
  }

  const handleConvert = () => {
    const trimmed = url.trim()
    if (trimmed) {
      localStorage.setItem('yt_url', trimmed)
    }
    navigate(format === 'mp3' ? '/mp3' : '/mp4')
  }

  useSEO({
    title: 'YouTube Video Downloader - Free YouTube Video MP3 MP4 Download Online | YTTune',
    description: 'Free online YouTube video downloader and MP3 converter. Download YouTube videos in MP4 (1080p, 720p HD) and convert YouTube to MP3 audio 320kbps fast with no software or signup.',
    keywords: 'youtube video mp3 mp4 download, youtube video download, youtube video downlod, youtube downloader, youtube to mp3, youtube to mp4, download youtube video, youtube video download mp3, youtube video download mp4, yt mp3 converter',
    canonical: 'https://yttune.vercel.app/',
  })

  return (
    <PageWrapper>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-8"
          >
            <Sparkles size={14} />
            100% Free YouTube Tools — No Signup Needed
            <ArrowRight size={14} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6"
          >
            Convert. Download.{' '}
            <span className="neon-text">Free.</span>
            <br />
            <span className="text-slate-400 text-4xl sm:text-5xl lg:text-6xl font-bold">No Limits. No Cost.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10"
          >
            The ultimate free toolkit for creators. Convert YouTube videos to MP3, download videos in HD, and generate AI scripts — all completely free.
          </motion.p>

          {/* URL Input Box & Format Switcher */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl mx-auto mb-6"
          >
            {/* MP3 / MP4 Selector Capsule */}
            <div className="flex items-center justify-center mb-4">
              <div className="inline-flex p-1 sm:p-1.5 rounded-2xl glass bg-black/50 border border-white/10 shadow-xl gap-1 sm:gap-2">
                <button
                  type="button"
                  onClick={() => setFormat('mp3')}
                  className={`flex items-center gap-2 sm:gap-2.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                    format === 'mp3'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/40 ring-1 ring-cyan-300/60 scale-[1.02]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Music size={15} className={format === 'mp3' ? 'text-white' : 'text-slate-400'} />
                  MP3 Audio
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('mp4')}
                  className={`flex items-center gap-2 sm:gap-2.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                    format === 'mp4'
                      ? 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white shadow-lg shadow-purple-500/40 ring-1 ring-purple-300/60 scale-[1.02]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Video size={15} className={format === 'mp4' ? 'text-white' : 'text-slate-400'} />
                  MP4 Video
                </button>
              </div>
            </div>

            <div className="glass rounded-2xl p-2 border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex items-center flex-1 min-w-0">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleConvert() }}
                  placeholder="Paste a YouTube video URL here..."
                  className="w-full px-4 py-3 bg-transparent text-white placeholder-slate-600 text-sm focus:outline-none"
                />
                {url && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="p-1.5 mr-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
                    title="Clear URL"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={handleConvert}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl text-white text-sm font-bold transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-[0.98] ${
                  format === 'mp3'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/30'
                    : 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:opacity-95 shadow-purple-500/30'
                }`}
              >
                <Download size={16} />
                Convert to {format.toUpperCase()}
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500"
          >
            {['No signup required', 'Always free', 'No watermarks'].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                {t}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-600"
        >
          <div className="w-6 h-10 rounded-full border-2 border-slate-700 flex items-start justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-cyan-400" />
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="glass rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-black neon-text mb-1">{stat.value}</div>
                <div className="text-slate-500 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Tools */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Our Free <span className="neon-text">Tools</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">Free tools to convert, download, and create — no account needed.</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {TOOLS.slice(0, 3).map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} index={i} />
            ))}
          </div>
          {/* <div className="text-center mt-8">
            <AnimatedButton variant="secondary" onClick={() => navigate('/tools')}>
              View All 50+ Tools <ArrowRight size={16} />
            </AnimatedButton>
          </div> */}
        </div>
      </section>

      {/* AI Script Preview */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-medium mb-6">
                <Sparkles size={12} />
                AI Script Generator
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Write viral scripts in <span className="neon-text">seconds</span>
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                Our AI understands your niche, tone, and audience. Generate YouTube scripts, ad copy, blog posts, and more with a single prompt.
              </p>
              <AnimatedButton onClick={() => navigate('/ai-script')}>
                <Sparkles size={16} />
                Try AI Script Generator
              </AnimatedButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-6 border border-pink-500/10"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-slate-600 text-xs ml-2">AI Script Output</span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="text-slate-500 text-xs">Prompt: "YouTube video about productivity hacks"</div>
                <div className="h-px bg-white/5" />
                <p className="text-cyan-400 font-semibold">🎬 Hook (0-5 seconds)</p>
                <p className="text-slate-300">"What if I told you that 90% of people are wasting 3 hours every single day? Today I'm revealing the 5 productivity secrets that changed my life..."</p>
                <p className="text-purple-400 font-semibold">📌 Main Points</p>
                <p className="text-slate-400">1. The 2-minute rule that eliminates procrastination<br />2. Time-blocking with the Pomodoro method<br />3. Digital minimalism for deep focus...</p>
                <div className="flex items-center gap-2 mt-4">
                  <div className="flex-1 h-1.5 rounded-full bg-white/5">
                    <div className="h-full w-3/4 rounded-full gradient-bg animate-gradient" />
                  </div>
                  <span className="text-slate-600 text-xs">Generating...</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Why <span className="neon-text">YTTune?</span>
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => <FeatureCard key={f.title} feature={f} index={i} />)}
          </div>
        </div>
      </section>

      {/* Pricing — Coming Soon
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Simple <span className="neon-text">Pricing</span>
            </h2>
            <p className="text-slate-500">Start free. Upgrade when you need more power.</p>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6">
            {PRICING.map((plan, i) => <PricingCard key={plan.name} plan={plan} index={i} />)}
          </div>
        </div>
      </section>
      */}

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Loved by <span className="neon-text">Creators</span>
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-5"
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={12} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">{t.name}</div>
                    <div className="text-slate-500 text-xs">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Frequently Asked <span className="neon-text">Questions</span>
            </h2>
          </motion.div>
          <FAQAccordion faqs={FAQS} />
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden p-12 text-center"
            style={{ background: 'linear-gradient(135deg, rgba(0,245,255,0.1), rgba(191,0,255,0.1), rgba(255,0,128,0.1))' }}
          >
            <div className="absolute inset-0 neon-border rounded-3xl" />
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 relative z-10">
              Start using free tools today
            </h2>
            <p className="text-slate-400 mb-8 relative z-10">Join 850,000+ creators using YTTune every day — completely free.</p>
            <div className="flex flex-wrap gap-4 justify-center relative z-10">
              <AnimatedButton onClick={() => navigate('/tools')}>
                Start for Free <ArrowRight size={16} />
              </AnimatedButton>
              {/* <AnimatedButton variant="secondary" onClick={() => navigate('/pricing')}>
                View Pricing
              </AnimatedButton> */}
            </div>
          </motion.div>
        </div>
      </section>
      {/* SEO Content + Internal Links */}
      <section className="py-16 px-4 border-t border-white/5 bg-black/20">
        <div className="max-w-4xl mx-auto space-y-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">
              YouTube Video MP3 MP4 Download — 100% Free Online Converter
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Looking for a reliable way to perform <strong className="text-white">YouTube video MP3 MP4 download</strong> without installing heavy desktop software or registering an account? <strong className="text-cyan-400">YTTune</strong> provides an ultra-fast, cloud-powered YouTube downloader and converter that lets you save YouTube videos in crystal-clear MP4 (up to 1080p Full HD) or extract studio-grade MP3 audio (up to 320kbps) in seconds.
            </p>
            <p className="text-slate-400 leading-relaxed text-sm">
              Whether you are looking to download YouTube videos for offline viewing on your mobile device, convert a podcast into an MP3 soundtrack, or grab high-framerate YouTube Shorts clips, YTTune is optimized for Android, iPhone (iOS), iPad, Windows, and Mac browsers.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                title: 'YouTube to MP3 Audio',
                desc: 'Extract MP3 audio from any YouTube video in 320kbps, 256kbps, or 192kbps. Complete with metadata & album art.',
                link: '/mp3',
                cta: 'Convert MP3 Online',
              },
              {
                title: 'YouTube Video MP4 HD',
                desc: 'Download YouTube videos in 1080p, 720p HD, and 480p MP4. Fast streaming and direct browser download.',
                link: '/mp4',
                cta: 'Download MP4 Video',
              },
              {
                title: 'AI Script Extractor',
                desc: 'Instantly extract full transcripts, video descriptions, and YouTube SEO tags with our AI tools.',
                link: '/ai-script',
                cta: 'Extract Video Script',
              },
            ].map((item) => (
              <div key={item.title} className="glass rounded-2xl p-6 border border-white/10 hover:border-cyan-500/30 transition-colors">
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">{item.desc}</p>
                <Link to={item.link} className="text-cyan-400 text-sm font-semibold hover:text-cyan-300 flex items-center gap-1">
                  {item.cta} →
                </Link>
              </div>
            ))}
          </div>

          <div className="glass rounded-2xl p-8 border border-white/10 space-y-6">
            <h2 className="text-2xl font-bold text-white">
              How to Download YouTube Video as MP3 or MP4
            </h2>
            <ol className="list-decimal list-inside space-y-3 text-slate-300 text-sm leading-relaxed">
              <li>
                <strong className="text-white">Copy the YouTube URL:</strong> Open the YouTube app or website, find your desired video or Shorts clip, and copy its link.
              </li>
              <li>
                <strong className="text-white">Choose MP3 or MP4:</strong> Paste the link into YTTune's search bar above and select whether you want MP3 audio or MP4 video.
              </li>
              <li>
                <strong className="text-white">Select Quality:</strong> Pick your preferred resolution (1080p FHD, 720p HD) or audio bitrate (320kbps, 192kbps).
              </li>
              <li>
                <strong className="text-white">Instant Download:</strong> Click Convert and save your file straight to your phone gallery, downloads folder, or computer drive.
              </li>
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Why Choose YTTune for YouTube Video Download?
            </h2>
            <ul className="grid sm:grid-cols-2 gap-4 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">✔</span>
                <span><strong className="text-white">No Registration:</strong> No signups, no email required, and no credit card ever.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">✔</span>
                <span><strong className="text-white">High Quality 1080p & 320kbps:</strong> Enjoy lossless audio and crisp high-definition video.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">✔</span>
                <span><strong className="text-white">Works on All Devices:</strong> Android phones, iPhones, iPads, MacBooks, and Windows PCs.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">✔</span>
                <span><strong className="text-white">Zero Watermarks:</strong> Keep your downloaded MP4 videos completely clean without annoying logos.</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-4 text-sm pt-4 border-t border-white/5">
            <span className="text-slate-500 font-medium">Quick Guides:</span>
            <Link to="/blog/youtube-to-mp3" className="text-cyan-400 hover:underline">How to Convert YouTube to MP3</Link>
            <Link to="/blog/download-youtube-shorts" className="text-cyan-400 hover:underline">How to Download YouTube Shorts</Link>
            <Link to="/blog/best-youtube-downloader" className="text-cyan-400 hover:underline">Best YouTube Downloader 2026</Link>
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}
