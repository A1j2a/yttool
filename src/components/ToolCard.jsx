import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, Music, Video, Sparkles, Download, Image, Mic, FileText, QrCode, Palette, Code, Captions, LayoutTemplate } from 'lucide-react'

const ICON_MAP = { Music, Video, Sparkles, Download, Image, Mic, FileText, QrCode, Palette, Code, Captions, LayoutTemplate }

export default function ToolCard({ tool, index = 0 }) {
  const Icon = ICON_MAP[tool.icon] || Sparkles
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link to={tool.path}>
        <div className="glass glass-hover rounded-2xl p-5 h-full group relative overflow-hidden">
          {tool.trending && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/30">
              <TrendingUp size={10} className="text-orange-400" />
              <span className="text-orange-400 text-xs font-medium">Hot</span>
            </div>
          )}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110"
            style={{ background: `${tool.color}18`, border: `1px solid ${tool.color}30` }}
          >
            <Icon size={20} style={{ color: tool.color }} />
          </div>
          <h3 className="text-white font-semibold text-sm mb-1">{tool.name}</h3>
          <p className="text-slate-500 text-xs leading-relaxed mb-3">{tool.desc}</p>
          <div className="flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-all" style={{ color: tool.color }}>
            Use Tool <ArrowRight size={12} />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
