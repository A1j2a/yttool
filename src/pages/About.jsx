import { motion } from "framer-motion";
import { PageWrapper } from "../animations";
import { STATS } from "../constants";
import { Zap, Target, Heart, Shield, Lock, Sparkles, CheckCircle2 } from "lucide-react";

export default function About() {
  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-cyan-500/20 text-cyan-400 text-sm mb-6">
            <Zap size={14} />
            About YTTune
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-6">
            Focused Tools for <span className="neon-text">YouTube</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Most online converters are cluttered with intrusive popups, slow redirects, and arbitrary paywalls. We created YTTune to offer a clean, reliable, and free alternative designed for creators, editors, and listeners.
          </p>
        </motion.div>

        {/* Mission */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {[
            {
              icon: Target,
              title: "Our Mission",
              desc: "Provide fast, high-quality audio and video extraction tools without subscriptions, paywalls, or registrations.",
              color: "#00f5ff",
            },
            {
              icon: Shield,
              title: "Privacy First",
              desc: "We process requests in real-time memory. We never maintain logs of converted links, user files, or personal information.",
              color: "#bf00ff",
            },
            {
              icon: Heart,
              title: "Community Focused",
              desc: "Engineered to keep working consistently as YouTube updates its player protocols, so your workflow never stalls.",
              color: "#ff0080",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background: `${item.color}15`,
                  border: `1px solid ${item.color}25`,
                }}
              >
                <item.icon size={22} style={{ color: item.color }} />
              </div>
              <h3 className="text-white font-bold mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-10 mb-20"
        >
          <h2 className="text-2xl font-black text-white text-center mb-10">
            Platform Specifications
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-black neon-text mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Core Principles */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-black text-white text-center mb-10"
          >
            What Sets <span className="neon-text">YTTune</span> Apart
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Zero Watermarks",
                desc: "Original audio streams and 1080p video frames remain untouched and completely unbranded.",
                icon: CheckCircle2,
              },
              {
                title: "Full Bitrate Audio",
                desc: "Direct conversion to 320 kbps MP3 preserving sound stage, vocals, and low-end bass frequencies.",
                icon: Sparkles,
              },
              {
                title: "Direct Browser Delivery",
                desc: "Files stream directly to your local drive without redirects to sketchy third-party domains.",
                icon: Lock,
              },
            ].map((principle, i) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                  <principle.icon size={20} />
                </div>
                <h3 className="text-white font-bold mb-2">{principle.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {principle.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
