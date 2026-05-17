import { motion } from 'framer-motion'
import { Zap, Shield, Globe, Cpu, Layers, RefreshCw } from 'lucide-react'

const ICON_MAP = { Zap, Shield, Globe, Cpu, Layers, RefreshCw }

export default function FeatureCard({ feature, index = 0 }) {
  const Icon = ICON_MAP[feature.icon] || Zap
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="glass glass-hover rounded-2xl p-6"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/20 flex items-center justify-center mb-4">
        <Icon size={22} className="text-cyan-400" />
      </div>
      <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
    </motion.div>
  )
}
