import { motion } from 'framer-motion'

export default function AnimatedButton({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button' }) {
  const variants = {
    primary: 'gradient-bg text-white shadow-lg shadow-cyan-500/20',
    secondary: 'glass border border-white/10 text-white hover:border-cyan-400/40',
    outline: 'border border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10',
    ghost: 'text-slate-400 hover:text-white hover:bg-white/5',
  }

  return (
    <motion.button
      type={type}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-2 justify-center ${variants[variant]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
    >
      {children}
    </motion.button>
  )
}
