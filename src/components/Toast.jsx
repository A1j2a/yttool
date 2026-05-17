import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

const ICONS = { success: CheckCircle, error: XCircle, warning: AlertCircle }
const COLORS = { success: 'text-green-400', error: 'text-red-400', warning: 'text-yellow-400' }

export default function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type] || CheckCircle
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="glass border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 min-w-64 shadow-xl"
            >
              <Icon size={18} className={COLORS[toast.type]} />
              <span className="text-white text-sm flex-1">{toast.message}</span>
              <button onClick={() => removeToast(toast.id)} className="text-slate-500 hover:text-white">
                <X size={14} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
