import { Link } from 'react-router-dom'
import { Share2, Code2, Rss, Globe, Heart } from 'lucide-react'
import { NAV_LINKS } from '../constants'
import logo from '../assets/YTTune.png'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 w-fit">
              <div className="px-2 py-1 rounded-xl bg-white/90 border border-white/20 shadow-sm">
                <img src={logo} alt="YTTune" className="h-7 w-auto object-contain" loading="lazy" />
              </div>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Free YouTube MP3 &amp; video downloader. Convert and download YouTube videos instantly — no signup needed.
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
              {[['YouTube to MP3', '/mp3'], ['YouTube to MP4', '/mp4'], ['AI Script', '/ai-script'], ['All Tools', '/tools']].map(([label, path]) => (
                <li key={path}>
                  <Link to={path} className="text-slate-500 hover:text-cyan-400 text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {[['About', '/about'], ['Contact', '/contact'], ['YouTube to MP3 Guide', '/blog/youtube-to-mp3'], ['Best YT Downloader', '/blog/best-youtube-downloader']].map(([label, path]) => (
                <li key={path}>
                  <Link to={path} className="text-slate-500 hover:text-cyan-400 text-sm transition-colors">{label}</Link>
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
          <p className="text-slate-600 text-sm">© 2025 YTTune. All rights reserved.</p>
          <p className="text-slate-600 text-sm flex items-center gap-1">
            Made with <Heart size={12} className="text-pink-500" /> for creators worldwide
          </p>
        </div>
      </div>
    </footer>
  )
}
