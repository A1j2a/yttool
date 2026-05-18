import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon, Zap } from 'lucide-react'
import { NAV_LINKS } from '../constants'
import { useTheme } from '../context/ThemeContext'
import logo from '../assets/YTTune.png'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { theme, toggle } = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMobileOpen(false), [location])

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass border-b border-white/5 shadow-lg shadow-black/20' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="px-2 py-1 rounded-xl bg-white/90 backdrop-blur-sm border border-white/20 shadow-md shadow-black/10 group-hover:shadow-lg transition-all">
                <img
                  src={logo}
                  alt="YTTune"
                  width={96}
                  height={28}
                  className="h-7 w-auto object-contain"
                  loading="eager"
                />
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'text-cyan-400 bg-cyan-400/10'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggle}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <Link
                to="/mp3"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg gradient-bg text-white text-sm font-semibold hover:opacity-90 transition-all hover:scale-105"
              >
                <Zap size={14} />
                Free Tools
              </Link>
              <button
                className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 glass border-l border-white/10 md:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="px-2 py-1 rounded-xl bg-white/90 border border-white/20">
                  <img src={logo} alt="YTTune" className="h-6 w-auto object-contain" loading="lazy" />
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-2 text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      location.pathname === link.path
                        ? 'text-cyan-400 bg-cyan-400/10'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/mp3"
                  className="mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-lg gradient-bg text-white text-sm font-semibold"
                >
                  <Zap size={14} />
                  Free Tools
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
