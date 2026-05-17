import { motion } from 'framer-motion'
import { PageWrapper } from '../animations'
import PricingCard from '../components/PricingCard'
import { PRICING } from '../constants'
import { Check } from 'lucide-react'

const COMPARISON = [
  { feature: 'Daily conversions', free: '5/day', pro: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Max video quality', free: '720p', pro: '4K', enterprise: '4K' },
  { feature: 'AI script credits', free: '10/mo', pro: '500/mo', enterprise: 'Unlimited' },
  { feature: 'Tools access', free: 'Basic', pro: 'All 50+', enterprise: 'All 50+' },
  { feature: 'API access', free: '✗', pro: '✓', enterprise: '✓' },
  { feature: 'Team workspace', free: '✗', pro: '✗', enterprise: '✓' },
  { feature: 'White-label', free: '✗', pro: '✗', enterprise: '✓' },
  { feature: 'Support', free: 'Community', pro: 'Priority', enterprise: 'Dedicated' },
]

export default function Pricing() {
  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Choose Your <span className="neon-text">Plan</span>
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto">Start free. Scale as you grow. No hidden fees.</p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-20">
          {PRICING.map((plan, i) => <PricingCard key={plan.name} plan={plan} index={i} />)}
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-black text-white text-center mb-8">
            Full <span className="neon-text">Comparison</span>
          </h2>
          <div className="glass rounded-2xl overflow-hidden">
            <div className="grid grid-cols-4 gap-0">
              <div className="p-4 text-slate-500 text-sm font-medium">Feature</div>
              {PRICING.map((p) => (
                <div key={p.name} className="p-4 text-center" style={{ color: p.color }}>
                  <span className="font-bold">{p.name}</span>
                </div>
              ))}
            </div>
            {COMPARISON.map((row, i) => (
              <div key={row.feature} className={`grid grid-cols-4 gap-0 ${i % 2 === 0 ? 'bg-white/2' : ''}`}>
                <div className="p-4 text-slate-400 text-sm">{row.feature}</div>
                {[row.free, row.pro, row.enterprise].map((val, j) => (
                  <div key={j} className="p-4 text-center text-sm">
                    {val === '✓' ? (
                      <Check size={16} className="text-green-400 mx-auto" />
                    ) : val === '✗' ? (
                      <span className="text-slate-700">—</span>
                    ) : (
                      <span className="text-slate-300">{val}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  )
}
