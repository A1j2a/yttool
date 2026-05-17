import { motion } from 'framer-motion'

export default function GlassCard({ children, className = '', hover = true, glow = false }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      transition={{ duration: 0.2 }}
      className={`glass rounded-2xl ${hover ? 'glass-hover cursor-pointer' : ''} ${
        glow ? 'animate-pulse-glow' : ''
      } ${className}`}
    >
      {children}
    </motion.div>
  )
}
