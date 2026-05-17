import { motion } from 'framer-motion'
import { PageWrapper, fadeUp } from '../animations'
import { STATS, TEAM } from '../constants'
import { Zap, Target, Heart } from 'lucide-react'

export default function About() {
  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-cyan-500/20 text-cyan-400 text-sm mb-6">
            <Zap size={14} />
            Our Story
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-6">
            Built for <span className="neon-text">Creators</span>,<br />by Creators
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            NexaTools was born from frustration. We were tired of juggling 10 different tools, paying for 5 subscriptions, and wasting hours on simple tasks. So we built the platform we always wanted.
          </p>
        </motion.div>

        {/* Mission */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {[
            { icon: Target, title: 'Our Mission', desc: 'Democratize access to premium media tools. Every creator deserves professional-grade tools without the professional price tag.', color: '#00f5ff' },
            { icon: Zap, title: 'Our Vision', desc: 'A world where creators spend time creating, not fighting with tools. We handle the technical complexity so you can focus on your craft.', color: '#bf00ff' },
            { icon: Heart, title: 'Our Values', desc: 'Privacy-first, creator-focused, and always improving. We listen to our community and ship new features every week.', color: '#ff0080' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${item.color}15`, border: `1px solid ${item.color}25` }}>
                <item.icon size={22} style={{ color: item.color }} />
              </div>
              <h3 className="text-white font-bold mb-2">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
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
          <h2 className="text-2xl font-black text-white text-center mb-10">NexaTools by the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-black neon-text mb-2">{stat.value}</div>
                <div className="text-slate-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Team */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-black text-white text-center mb-10"
          >
            Meet the <span className="neon-text">Team</span>
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 text-center glass-hover"
              >
                <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                  {member.avatar}
                </div>
                <h3 className="text-white font-bold mb-1">{member.name}</h3>
                <p className="text-cyan-400 text-xs font-medium mb-3">{member.role}</p>
                <p className="text-slate-500 text-xs leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
