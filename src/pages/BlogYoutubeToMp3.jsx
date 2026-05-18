import { Link } from 'react-router-dom'
import { PageWrapper } from '../animations'
import { useSEO } from '../hooks/useSEO'

export default function BlogYoutubeToMp3() {
  useSEO({
    title: 'How to Convert YouTube to MP3 Free — NexaTools',
    description: 'Step-by-step guide to convert any YouTube video to MP3 audio for free. No software needed, works on mobile and desktop.',
    canonical: 'https://nexatools.io/blog/youtube-to-mp3',
  })

  return (
    <PageWrapper>
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-4xl font-black text-white mb-4">How to Convert YouTube to MP3 for Free</h1>
        <p className="text-slate-400 mb-8">Last updated: 2025 · 3 min read</p>

        <p className="text-slate-300 leading-relaxed mb-6">
          Want to save your favourite YouTube music or podcast as an MP3? With <strong className="text-white">NexaTools</strong>, you can convert any YouTube video to high-quality MP3 audio in seconds — completely free, no account needed.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">How to Use the YouTube to MP3 Converter</h2>
        <ol className="list-decimal list-inside space-y-3 text-slate-300 mb-8">
          <li>Copy the YouTube video URL from your browser or the YouTube app.</li>
          <li>Paste it into the <Link to="/mp3" className="text-cyan-400 hover:underline">NexaTools MP3 Converter</Link>.</li>
          <li>Select your preferred audio quality (128kbps, 192kbps, or 256kbps).</li>
          <li>Click <strong className="text-white">Convert to MP3</strong> and wait a few seconds.</li>
          <li>Hit <strong className="text-white">Download MP3</strong> — done!</li>
        </ol>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">Why Choose NexaTools?</h2>
        <ul className="list-disc list-inside space-y-2 text-slate-300 mb-8">
          <li>100% free — no hidden fees or subscriptions</li>
          <li>No signup or account required</li>
          <li>Works on mobile, tablet, and desktop</li>
          <li>High-quality audio up to 320kbps</li>
          <li>Files are never stored on our servers</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4 mb-10">
          {[
            { q: 'Is it legal to convert YouTube to MP3?', a: 'Converting YouTube videos for personal, offline use is generally accepted. Do not distribute copyrighted content.' },
            { q: 'What quality is the MP3?', a: 'You can choose from 128kbps, 192kbps, or 256kbps. Higher quality means larger file size.' },
            { q: 'Does it work on iPhone?', a: 'Yes! NexaTools works on all devices including iPhone, Android, Mac, and Windows.' },
          ].map(({ q, a }) => (
            <div key={q} className="glass rounded-xl p-4">
              <h3 className="text-white font-semibold mb-1">{q}</h3>
              <p className="text-slate-400 text-sm">{a}</p>
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl p-6 text-center">
          <p className="text-white font-semibold mb-3">Ready to convert?</p>
          <Link to="/mp3" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-all">
            Try YouTube to MP3 Converter →
          </Link>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap gap-4 text-sm">
          <span className="text-slate-500">Also see:</span>
          <Link to="/blog/download-youtube-shorts" className="text-cyan-400 hover:underline">Download YouTube Shorts</Link>
          <Link to="/blog/best-youtube-downloader" className="text-cyan-400 hover:underline">Best YouTube Downloader</Link>
          <Link to="/mp4" className="text-cyan-400 hover:underline">YouTube to MP4</Link>
        </div>
      </article>
    </PageWrapper>
  )
}
