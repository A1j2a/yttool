import { Link } from 'react-router-dom'
import { Zap, Share2, Code2, Rss, Globe, Heart } from 'lucide-react'
import { NAV_LINKS } from '../constants'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <span className="text-xl font-bold neon-text">NexaTools</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              The ultimate AI-powered media utility platform. Convert, create, and automate.
            </p>
            <div className="flex items-center gap-3">
              {[Share2, Code2, Rss, Globe].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-400/30 transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-white font-semibold mb-4">Tools</h4>
            <ul className="space-y-2">
              {[['MP3 Converter', '/mp3'], ['MP4 Converter', '/mp4'], ['AI Script', '/ai-script'], ['All Tools', '/tools']].map(([label, path]) => (
                <li key={path}>
                  <Link to={path} className="text-slate-500 hover:text-cyan-400 text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {[['About', '/about'], ['Pricing', '/pricing'], ['Contact', '/contact']].map(([label, path]) => (
                <li key={path}>
                  <Link to={path} className="text-slate-500 hover:text-cyan-400 text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4">Stay Updated</h4>
            <p className="text-slate-500 text-sm mb-4">Get notified when we launch new tools.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 rounded-lg glass border border-white/10 text-sm text-white placeholder-slate-600 bg-transparent"
              />
              <button className="px-4 py-2 rounded-lg gradient-bg text-white text-sm font-medium hover:opacity-90 transition-all">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">© 2025 NexaTools. All rights reserved.</p>
          <p className="text-slate-600 text-sm flex items-center gap-1">
            Made with <Heart size={12} className="text-pink-500" /> for creators worldwide
          </p>
        </div>
      </div>
    </footer>
  )
}
