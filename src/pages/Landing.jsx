import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Download, Sparkles, Play, Star } from 'lucide-react'
import { PageWrapper, staggerContainer, fadeUp } from '../animations'
import ToolCard from '../components/ToolCard'
import FeatureCard from '../components/FeatureCard'
import PricingCard from '../components/PricingCard'
import FAQAccordion from '../components/FAQAccordion'
import AnimatedButton from '../components/AnimatedButton'
import { TOOLS, FEATURES, STATS, PRICING, TESTIMONIALS, FAQS } from '../constants'

export default function Landing() {
  const [url, setUrl] = useState('')
  const navigate = useNavigate()

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
            AI-Powered Media Platform — 50+ Tools
            <ArrowRight size={14} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6"
          >
            Convert. Create.{' '}
            <span className="neon-text">Automate.</span>
            <br />
            <span className="text-slate-400 text-4xl sm:text-5xl lg:text-6xl font-bold">All in One Place.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10"
          >
            The ultimate toolkit for creators. Convert videos, generate AI scripts, download media, and access 50+ premium tools — free.
          </motion.p>

          {/* URL Input Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl mx-auto mb-6"
          >
            <div className="glass rounded-2xl p-2 border border-white/10 flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste a YouTube, TikTok, or any video URL..."
                className="flex-1 px-4 py-3 bg-transparent text-white placeholder-slate-600 text-sm"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/mp3')}
                  className="px-4 py-3 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-medium hover:bg-cyan-500/30 transition-all whitespace-nowrap"
                >
                  MP3
                </button>
                <button
                  onClick={() => navigate('/mp4')}
                  className="px-4 py-3 rounded-xl gradient-bg text-white text-sm font-semibold hover:opacity-90 transition-all whitespace-nowrap flex items-center gap-2"
                >
                  <Download size={14} />
                  Convert
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500"
          >
            {['No signup required', 'Free forever', '1000+ supported sites'].map((t) => (
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
              Popular <span className="neon-text">Tools</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">Everything you need to create, convert, and automate your media workflow.</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {TOOLS.slice(0, 8).map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} index={i} />
            ))}
          </div>
          <div className="text-center mt-8">
            <AnimatedButton variant="secondary" onClick={() => navigate('/tools')}>
              View All 50+ Tools <ArrowRight size={16} />
            </AnimatedButton>
          </div>
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
              Why <span className="neon-text">NexaTools?</span>
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => <FeatureCard key={f.title} feature={f} index={i} />)}
          </div>
        </div>
      </section>

      {/* Pricing */}
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
              Ready to supercharge your workflow?
            </h2>
            <p className="text-slate-400 mb-8 relative z-10">Join 850,000+ creators using NexaTools every day.</p>
            <div className="flex flex-wrap gap-4 justify-center relative z-10">
              <AnimatedButton onClick={() => navigate('/tools')}>
                Start for Free <ArrowRight size={16} />
              </AnimatedButton>
              <AnimatedButton variant="secondary" onClick={() => navigate('/pricing')}>
                View Pricing
              </AnimatedButton>
            </div>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  )
}
