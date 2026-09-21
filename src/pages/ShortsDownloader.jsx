import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Video,
  Music,
  Download,
  CheckCircle,
  Link as LinkIcon,
  Play,
  Pause,
  Volume2,
  Maximize,
  RotateCcw,
  X,
  Sparkles,
  Zap,
  Shield,
  Smartphone,
} from "lucide-react";
import { PageWrapper } from "../animations";
import AnimatedButton from "../components/AnimatedButton";
import GlassCard from "../components/GlassCard";
import { useToast } from "../hooks/useToast";
import { useSEO } from "../hooks/useSEO";
import Toast from "../components/Toast";
import FAQAccordion from "../components/FAQAccordion";
import { API_BASE } from "../config/api";
import { extractVideoId } from "../utils/urlValidator";

const SHORTS_FAQS = [
  {
    q: "How to download YouTube Shorts videos for free?",
    a: "Open YouTube and find the Shorts video you want. Click the Share button and copy the link. Paste the URL into YTTune's Shorts Downloader above, select MP4 or MP3, and click Download. Your file will automatically download to your device in full HD.",
  },
  {
    q: "Can I download YouTube Shorts on iPhone and Android mobile?",
    a: "Yes! YTTune works natively on iOS Safari, Android Chrome, Samsung Internet, Firefox, and all mobile browsers without installing any third-party apps or software.",
  },
  {
    q: "Can I convert YouTube Shorts into MP3 audio sound?",
    a: "Absolutely. Select the 'MP3 Audio' tab above, paste the Shorts link, and click Download. Our converter will instantly extract the background audio track in high-fidelity 320kbps MP3.",
  },
  {
    q: "Are YouTube Shorts downloaded without watermark?",
    a: "Yes. All YouTube Shorts downloaded through YTTune are completely clean, original high-resolution MP4 video files with no added watermarks.",
  },
  {
    q: "Is there any limit on how many YouTube Shorts I can download?",
    a: "No limits at all! You can download as many YouTube Shorts as you want 100% free with unlimited conversions.",
  },
];

const API = API_BASE;

async function fetchShortsMedia(url, format = "mp4") {
  const endpoint = format === "mp3" ? "/api/mp3" : "/api/mp4?resolution=1080";
  const res = await fetch(`${API}${endpoint}${endpoint.includes("?") ? "&" : "?"}url=${encodeURIComponent(url)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Server error ${res.status}`);
  }
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("text/html")) {
    throw new Error("Server returned invalid response. Please try again.");
  }
  const title = decodeURIComponent(res.headers.get("X-Video-Title") || "YouTube Shorts");
  const thumb = decodeURIComponent(res.headers.get("X-Video-Thumb") || "");
  const blob = await res.blob();
  const downloadUrl = URL.createObjectURL(blob);
  return { title, thumb, downloadUrl, blob };
}

export default function ShortsDownloader() {
  const [url, setUrl] = useState(() => localStorage.getItem("yt_url") || "");
  const [format, setFormat] = useState("mp4"); // mp4 | mp3
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);
  const { toasts, addToast, removeToast } = useToast();
  const videoRef = useRef(null);

  const videoId = extractVideoId(url);
  const thumbUrl = result?.thumb || (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null);

  const canonicalUrl = "https://yttune.vercel.app/shorts";

  useSEO({
    title: "YouTube Shorts Download - Free YouTube Shorts Video Downloader MP4 & MP3 | YTTune",
    description: "Free online YouTube Shorts downloader. Download YouTube Shorts videos in 1080p Full HD MP4 or convert Shorts to MP3 audio on iPhone, Android, and PC. Fast & 100% free.",
    keywords: "youtube shorts download, youtube shorts downloader, download youtube shorts, download youtube shorts video, youtube shorts video download, youtube shorts to mp4, youtube shorts to mp3, download shorts from youtube, free youtube shorts download online",
    canonical: canonicalUrl,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          "name": "YTTune YouTube Shorts Downloader",
          "url": canonicalUrl,
          "description": "Free tool to download YouTube Shorts videos in HD MP4 or extract MP3 audio.",
          "applicationCategory": "MultimediaApplication",
          "operatingSystem": "All",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://yttune.vercel.app/" },
            { "@type": "ListItem", "position": 2, "name": "YouTube Shorts Downloader", "item": canonicalUrl },
          ],
        },
        {
          "@type": "FAQPage",
          "mainEntity": SHORTS_FAQS.map((f) => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a },
          })),
        },
      ],
    },
  });

  const handleUrlChange = (val) => {
    setUrl(val);
    setStatus("idle");
    setSaved(false);
    if (val.trim()) {
      localStorage.setItem("yt_url", val.trim());
    } else {
      localStorage.removeItem("yt_url");
    }
  };

  const handleClearUrl = () => {
    setUrl("");
    setStatus("idle");
    setSaved(false);
    localStorage.removeItem("yt_url");
  };

  const handleConvert = async () => {
    const trimmed = url.trim();
    if (!trimmed) {
      addToast("Please paste a YouTube Shorts link", "error");
      return;
    }
    setStatus("loading");
    setResult(null);
    setSaved(false);

    try {
      const data = await fetchShortsMedia(trimmed, format);
      setResult(data);
      setStatus("done");

      // Auto-trigger direct download to device
      try {
        const ext = format === "mp3" ? "mp3" : "mp4";
        const filename = `${(data.title || "shorts").replace(/[^a-z0-9]/gi, "_").toLowerCase()}_shorts.${ext}`;
        const a = document.createElement("a");
        a.href = data.downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setSaved(true);
        addToast("Shorts downloaded directly to your device!", "success");
      } catch {
        // browser block fallback
      }
    } catch (err) {
      setStatus("error");
      addToast(err.message || "Failed to download Shorts. Please try again.", "error");
    }
  };

  const handleManualDownload = () => {
    if (!result?.downloadUrl) return;
    const ext = format === "mp3" ? "mp3" : "mp4";
    const a = document.createElement("a");
    a.href = result.downloadUrl;
    a.download = `${(result.title || "shorts").replace(/[^a-z0-9]/gi, "_").toLowerCase()}_shorts.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setSaved(true);
    addToast("Saved to your device!", "success");
  };

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-8 sm:py-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-purple-500/30 text-purple-400 text-xs sm:text-sm font-semibold mb-4 shadow-lg shadow-purple-500/10">
            <Sparkles size={14} className="text-purple-400" />
            <span>Fast & 100% Free YouTube Shorts Downloader</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
            YouTube Shorts <span className="gradient-text">Downloader</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Download your favorite YouTube Shorts videos in Full HD 1080p MP4 or convert to MP3 audio without watermarks.
          </p>
        </motion.div>

        {/* Converter Box */}
        <GlassCard hover={false} className="p-4 sm:p-8 mb-8 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Format Selector Tabs */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <button
              type="button"
              onClick={() => { setFormat("mp4"); setStatus("idle"); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                format === "mp4"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30"
                  : "glass text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Video size={16} />
              MP4 Video (1080p HD)
            </button>
            <button
              type="button"
              onClick={() => { setFormat("mp3"); setStatus("idle"); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                format === "mp3"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                  : "glass text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Music size={16} />
              MP3 Audio (320kbps)
            </button>
          </div>

          {/* Input Box */}
          <label className="block text-slate-300 text-xs sm:text-sm font-medium mb-2">
            Paste YouTube Shorts Link
          </label>
          <div className="relative mb-5">
            <LinkIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
              type="url"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleConvert(); }}
              placeholder="https://youtube.com/shorts/... or https://youtu.be/..."
              className="w-full pl-10 pr-10 py-3.5 rounded-xl glass border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
            />
            {url && (
              <button
                type="button"
                onClick={handleClearUrl}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-1"
                title="Clear URL"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Thumbnail preview */}
          {thumbUrl && status === "idle" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-5 rounded-xl overflow-hidden max-w-xs mx-auto border border-white/10">
              <img src={thumbUrl} alt="Shorts preview" className="w-full h-48 object-cover" />
            </motion.div>
          )}

          <AnimatedButton
            onClick={handleConvert}
            disabled={status === "loading"}
            className="w-full py-3.5 text-base flex items-center justify-center gap-2"
          >
            <Download size={18} />
            {status === "loading" ? "Processing Shorts..." : `Download Shorts as ${format.toUpperCase()}`}
          </AnimatedButton>
        </GlassCard>

        {/* Loading */}
        {status === "loading" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 mb-8 border border-purple-500/20">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 rounded-full border-2 border-purple-400 border-t-transparent animate-spin flex-shrink-0" />
              <div>
                <p className="text-white text-sm font-medium">Processing YouTube Shorts...</p>
                <p className="text-slate-400 text-xs mt-0.5">Fetching stream & preparing high-speed download</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-purple-400 text-xs font-medium bg-purple-500/10 px-3.5 py-2.5 rounded-xl">
              <Download size={15} className="animate-bounce flex-shrink-0" />
              <span>Conversion complete hote hi Shorts file aapki device me automatically download ho jayegi.</span>
            </div>
          </motion.div>
        )}

        {/* Result */}
        {status === "done" && result && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-2xl p-6 mb-8 border border-green-500/20">
            <div className="flex items-center gap-2.5 mb-4 text-green-400 font-semibold text-sm">
              <CheckCircle size={18} />
              <span>Downloaded Directly to Your Device</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
              {thumbUrl && (
                <img src={thumbUrl} alt="thumbnail" className="w-24 h-32 rounded-xl object-cover border border-white/10 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <h3 className="text-white font-bold text-base truncate mb-1">{result.title}</h3>
                <p className="text-slate-400 text-xs mb-3">Format: {format.toUpperCase()} • High Definition</p>
                <button
                  type="button"
                  onClick={handleManualDownload}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white text-xs font-bold transition-all shadow-lg shadow-purple-500/30"
                >
                  <Download size={14} />
                  Download Again to Device
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Features Grid */}
        <section className="grid sm:grid-cols-3 gap-4 mb-16">
          <div className="glass rounded-xl p-5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-3">
              <Zap size={20} />
            </div>
            <h3 className="text-white font-bold text-sm mb-1.5">⚡ Ultra Fast Download</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Direct high-speed stream processing downloads any YouTube Shorts in just a few seconds.
            </p>
          </div>
          <div className="glass rounded-xl p-5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 mb-3">
              <Smartphone size={20} />
            </div>
            <h3 className="text-white font-bold text-sm mb-1.5">📱 Mobile & PC Friendly</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Works seamlessly on iOS Safari, Android, Mac, and Windows with zero software installation.
            </p>
          </div>
          <div className="glass rounded-xl p-5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3">
              <Shield size={20} />
            </div>
            <h3 className="text-white font-bold text-sm mb-1.5">🔒 Safe & No Watermark</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Enjoy 100% clean video downloads without annoying logos, watermarks, or compression artifacts.
            </p>
          </div>
        </section>

        {/* Rich SEO Content Section */}
        <article className="glass rounded-2xl p-6 sm:p-10 border border-white/10 space-y-8 mb-16 text-slate-300 text-sm sm:text-base leading-relaxed">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
              YouTube Shorts Download — Download YouTube Shorts Videos Online Free
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              YouTube Shorts have become one of the most engaging ways to consume quick tutorials, viral comedy clips, and music highlights. With <strong>YTTune YouTube Shorts Downloader</strong>, you can download any public YouTube Shorts video directly to your smartphone, tablet, or desktop in full high definition 1080p MP4.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Whether you want to save educational reels for offline watching or convert viral Shorts into MP3 audio tracks for ringtones and playlists, YTTune provides a 100% free, unlimited, and secure cloud solution.
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              How to Download YouTube Shorts to MP4 Online
            </h2>
            <ol className="list-decimal list-inside space-y-3 text-slate-300 text-sm">
              <li><strong className="text-white">Copy Shorts URL:</strong> Open the YouTube app or website, navigate to the Shorts video, tap <em>Share</em>, and copy the link.</li>
              <li><strong className="text-white">Paste URL into YTTune:</strong> Paste the copied link into the input box at the top of this page.</li>
              <li><strong className="text-white">Select Format & Download:</strong> Choose <em>MP4 Video</em> or <em>MP3 Audio</em> and click Download. The file will save directly to your device downloads folder.</li>
            </ol>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Why Choose YTTune for YouTube Shorts Download?
            </h2>
            <ul className="grid sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-400">
              <li className="flex items-center gap-2">✅ No registration, signup, or app download required</li>
              <li className="flex items-center gap-2">✅ Full HD 1080p and 720p resolution support</li>
              <li className="flex items-center gap-2">✅ Convert Shorts to 320kbps MP3 audio</li>
              <li className="flex items-center gap-2">✅ Works on Android, iPhone, iPad, PC, and Mac</li>
              <li className="flex items-center gap-2">✅ 100% free with unlimited daily downloads</li>
              <li className="flex items-center gap-2">✅ No watermark added to video</li>
            </ul>
          </div>
        </article>

        {/* FAQs */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Frequently Asked Questions about YouTube Shorts Download
          </h2>
          <FAQAccordion items={SHORTS_FAQS} />
        </section>

        {/* Bottom Toasts */}
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
          {toasts.map((t) => (
            <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
