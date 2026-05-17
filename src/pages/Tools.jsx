import { useState } from 'react'
import { motion } from 'framer-motion'
import { PageWrapper } from '../animations'
import ToolCard from '../components/ToolCard'
import SearchBar from '../components/SearchBar'
import { TOOLS, CATEGORIES } from '../constants'
import { TrendingUp } from 'lucide-react'

export default function Tools() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = TOOLS.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCategory === 'All' || t.category === activeCategory
    return matchSearch && matchCat
  })

  const trending = TOOLS.filter((t) => t.trending)

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            All <span className="neon-text">Tools</span>
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto">50+ premium tools for creators, developers, and marketers.</p>
        </motion.div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-8">
          <SearchBar value={search} onChange={setSearch} placeholder="Search 50+ tools..." />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'gradient-bg text-white'
                  : 'glass border border-white/10 text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Trending */}
        {activeCategory === 'All' && !search && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={18} className="text-orange-400" />
              <h2 className="text-white font-bold text-lg">Trending Now</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {trending.map((tool, i) => (
                <ToolCard key={tool.id} tool={tool} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* All Tools Grid */}
        <div>
          <h2 className="text-white font-bold text-lg mb-6">
            {filtered.length} {activeCategory !== 'All' ? activeCategory : ''} Tools
          </h2>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((tool, i) => (
                <ToolCard key={tool.id} tool={tool} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500">
              <p className="text-lg">No tools found for "{search}"</p>
              <p className="text-sm mt-2">Try a different search term</p>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
