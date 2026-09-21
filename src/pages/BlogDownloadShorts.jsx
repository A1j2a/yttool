import { Link } from "react-router-dom";
import { PageWrapper } from "../animations";
import { useSEO } from "../hooks/useSEO";

export default function BlogDownloadShorts() {
  useSEO({
    title: "How to Download YouTube Shorts — YTTune",
    description:
      "Download YouTube Shorts videos for free in HD quality. Works on iPhone, Android, and desktop. No app needed.",
    canonical: "https://yttune.vercel.app/blog/download-youtube-shorts",
  });

  return (
    <PageWrapper>
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-4xl font-black text-white mb-4">
          How to Download YouTube Shorts for Free
        </h1>
        <p className="text-slate-400 mb-8">Last updated: 2025 · 3 min read</p>

        <p className="text-slate-300 leading-relaxed mb-6">
          YouTube Shorts are short-form vertical videos — and now you can
          download them instantly using{" "}
          <strong className="text-white">YTTune</strong>. Save any Short as MP4
          or extract its audio as MP3, all for free.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          Steps to Download a YouTube Short
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-slate-300 mb-8">
          <li>Open the YouTube Short you want to download.</li>
          <li>
            Copy the URL — it will look like{" "}
            <code className="text-cyan-400 text-xs bg-white/5 px-1 rounded">
              youtube.com/shorts/VIDEO_ID
            </code>
            .
          </li>
          <li>
            Paste it into the{" "}
            <Link to="/mp4" className="text-cyan-400 hover:underline">
              YTTune MP4 Downloader
            </Link>
            .
          </li>
          <li>
            Choose your resolution and click{" "}
            <strong className="text-white">Download MP4</strong>.
          </li>
        </ol>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          Can I Convert a Short to MP3?
        </h2>
        <p className="text-slate-300 mb-6">
          Yes! Use the{" "}
          <Link to="/mp3" className="text-cyan-400 hover:underline">
            YouTube to MP3 Converter
          </Link>{" "}
          and paste the Shorts URL. You'll get the audio extracted in seconds.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">FAQ</h2>
        <div className="space-y-4 mb-10">
          {[
            {
              q: "Does it work on mobile?",
              a: "Yes, YTTune works on all devices — iPhone, Android, and desktop browsers.",
            },
            {
              q: "What resolution are YouTube Shorts?",
              a: "Shorts are vertical 9:16 videos, typically available in 720p or 1080p.",
            },
            {
              q: "Is it free?",
              a: "Completely free. No account, no watermark, no limits.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="glass rounded-xl p-4">
              <h3 className="text-white font-semibold mb-1">{q}</h3>
              <p className="text-slate-400 text-sm">{a}</p>
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl p-6 text-center">
          <p className="text-white font-semibold mb-3">Download a Short now</p>
          <Link
            to="/mp4"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-all"
          >
            Try YouTube Downloader →
          </Link>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap gap-4 text-sm">
          <span className="text-slate-500">Also see:</span>
          <Link
            to="/blog/youtube-to-mp3"
            className="text-cyan-400 hover:underline"
          >
            YouTube to MP3
          </Link>
          <Link
            to="/blog/best-youtube-downloader"
            className="text-cyan-400 hover:underline"
          >
            Best YouTube Downloader
          </Link>
          <Link to="/mp3" className="text-cyan-400 hover:underline">
            MP3 Converter
          </Link>
        </div>
      </article>
    </PageWrapper>
  );
}
