import { motion } from 'framer-motion'
import { Check, Zap } from 'lucide-react'
import AnimatedButton from './AnimatedButton'

export default function PricingCard({ plan, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className={`relative rounded-2xl p-6 flex flex-col ${
        plan.popular
          ? 'neon-border bg-gradient-to-b from-purple-500/10 to-transparent'
          : 'glass'
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-bg text-white text-xs font-bold">
          Most Popular
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-white font-bold text-lg mb-1">{plan.name}</h3>
        <div className="flex items-end gap-1">
          <span className="text-4xl font-black" style={{ color: plan.color }}>{plan.price}</span>
          <span className="text-slate-500 text-sm mb-1">{plan.period}</span>
        </div>
      </div>
      <ul className="space-y-3 flex-1 mb-6">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-3 text-sm text-slate-300">
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${plan.color}20` }}>
              <Check size={11} style={{ color: plan.color }} />
            </div>
            {f}
          </li>
        ))}
      </ul>
      <AnimatedButton
        variant={plan.popular ? 'primary' : 'secondary'}
        className="w-full"
      >
        {plan.popular && <Zap size={14} />}
        {plan.cta}
      </AnimatedButton>
    </motion.div>
  )
}
