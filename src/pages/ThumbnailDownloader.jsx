import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Image,
  Download,
  Link as LinkIcon,
  X,
  Sparkles,
  CheckCircle,
  Eye,
  Layers,
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
import { extractVideoId } from "../utils/urlValidator";

const THUMBNAIL_FAQS = [
  {
    q: "How to download YouTube video thumbnail in HD quality?",
    a: "Copy the YouTube video link from YouTube, paste it into the box above, and click 'Get Thumbnails'. Choose your preferred resolution (1080p Full HD, 720p, or Standard) and click 'Download Image'. The thumbnail will instantly save to your device.",
  },
  {
    q: "Can I download thumbnails from YouTube Shorts videos?",
    a: "Yes! YTTune supports all YouTube Shorts links as well as standard YouTube videos. Simply paste the Shorts link and the tool will automatically extract the high-resolution cover image.",
  },
  {
    q: "What is the highest resolution YouTube thumbnail available?",
    a: "The maximum resolution is 1080p (1920x1080 pixels) known as MaxResDefault. If the creator uploaded a full HD thumbnail, YTTune will provide the full 1080p original file.",
  },
  {
    q: "Is downloading YouTube thumbnails free and legal?",
    a: "Yes, downloading YouTube thumbnails for personal reference, analysis, design inspiration, or educational purposes is 100% free with no account or signup needed.",
  },
  {
    q: "Can I download YouTube thumbnails on Android and iPhone?",
    a: "Yes, YTTune works natively on mobile Safari and Chrome. You can download the thumbnail image directly to your iPhone Camera Roll or Android Gallery.",
  },
];

const RESOLUTION_OPTIONS = [
  {
    label: "Maximum Resolution (1080p Full HD)",
    suffix: "maxresdefault.jpg",
    desc: "1920 × 1080 pixels • Highest Quality Available",
    badge: "1080p HD",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    label: "High Quality (HD)",
    suffix: "hqdefault.jpg",
    desc: "480 × 360 pixels • Standard High Quality",
    badge: "HD",
    badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  },
  {
    label: "Standard Definition (SD)",
    suffix: "sddefault.jpg",
    desc: "640 × 480 pixels • Crisp & Lightweight",
    badge: "SD",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
  {
    label: "Medium Quality (MQ)",
    suffix: "mqdefault.jpg",
    desc: "320 × 180 pixels • Compact Preview",
    badge: "MQ",
    badgeColor: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  },
];

export default function ThumbnailDownloader() {
  const [url, setUrl] = useState(() => localStorage.getItem("yt_url") || "");
  const [activeVideoId, setActiveVideoId] = useState(() => extractVideoId(localStorage.getItem("yt_url") || ""));
  const { toasts, addToast, removeToast } = useToast();

  const canonicalUrl = "https://yttune.vercel.app/thumbnail";

  useSEO({
    title: "YouTube Thumbnail Download - Download YouTube Thumbnail HD 1080p, 4K Online | YTTune",
    description: "Free online YouTube thumbnail downloader. Grab and download YouTube video thumbnails in 1080p Full HD, 720p, and 4K quality instantly. Works on iPhone, Android, and PC.",
    keywords: "youtube thumbnail download, download youtube thumbnail, youtube thumbnail grabber, youtube thumbnail 1080p, download youtube video thumbnail, get youtube thumbnail hd, youtube shorts thumbnail download, save youtube thumbnail online free",
    canonical: canonicalUrl,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          "name": "YTTune YouTube Thumbnail Downloader",
          "url": canonicalUrl,
          "description": "Free tool to grab and download YouTube video thumbnails in HD, 1080p, and 4K resolution.",
          "applicationCategory": "MultimediaApplication",
          "operatingSystem": "All",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://yttune.vercel.app/" },
            { "@type": "ListItem", "position": 2, "name": "YouTube Thumbnail Downloader", "item": canonicalUrl },
          ],
        },
        {
          "@type": "FAQPage",
          "mainEntity": THUMBNAIL_FAQS.map((f) => ({
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
    if (val.trim()) {
      localStorage.setItem("yt_url", val.trim());
      const id = extractVideoId(val.trim());
      if (id) setActiveVideoId(id);
    } else {
      localStorage.removeItem("yt_url");
      setActiveVideoId(null);
    }
  };

  const handleClearUrl = () => {
    setUrl("");
    setActiveVideoId(null);
    localStorage.removeItem("yt_url");
  };

  const handleFetch = () => {
    const trimmed = url.trim();
    if (!trimmed) {
      addToast("Please enter a YouTube video URL", "error");
      return;
    }
    const id = extractVideoId(trimmed);
    if (!id) {
      addToast("Invalid YouTube URL. Please check the link.", "error");
      return;
    }
    setActiveVideoId(id);
    addToast("Thumbnails generated in all resolutions!", "success");
  };

  const downloadImage = async (imgUrl, filename) => {
    try {
      const res = await fetch(imgUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      addToast("Thumbnail saved to your device!", "success");
    } catch {
      window.open(imgUrl, "_blank");
      addToast("Opening image in new tab. Long-press or right-click to save.", "info");
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-8 sm:py-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold mb-4 shadow-lg shadow-emerald-500/10">
            <Sparkles size={14} className="text-emerald-400" />
            <span>Instant Full HD 1080p Thumbnail Grabber</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
            YouTube Thumbnail <span className="gradient-text">Downloader</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Extract and download YouTube video thumbnails in 1080p Full HD, 720p, and Standard definition for free.
          </p>
        </motion.div>

        {/* Input Box */}
        <GlassCard hover={false} className="p-4 sm:p-8 mb-10 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <label className="block text-slate-300 text-xs sm:text-sm font-medium mb-2">
            Paste YouTube Video or Shorts URL
          </label>
          <div className="relative mb-5">
            <LinkIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
              type="url"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleFetch(); }}
              placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
              className="w-full pl-10 pr-10 py-3.5 rounded-xl glass border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
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

          <AnimatedButton
            onClick={handleFetch}
            className="w-full py-3.5 text-base flex items-center justify-center gap-2"
          >
            <Image size={18} />
            Get YouTube Thumbnails
          </AnimatedButton>
        </GlassCard>

        {/* Thumbnails Grid */}
        {activeVideoId && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 mb-16">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <CheckCircle size={22} className="text-emerald-400" />
                Available Thumbnail Resolutions
              </h2>
              <span className="text-slate-400 text-xs font-medium">Video ID: {activeVideoId}</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {RESOLUTION_OPTIONS.map((opt) => {
                const imgUrl = `https://img.youtube.com/vi/${activeVideoId}/${opt.suffix}`;
                const filename = `youtube_thumbnail_${activeVideoId}_${opt.badge.toLowerCase()}.jpg`;

                return (
                  <div key={opt.suffix} className="glass rounded-2xl overflow-hidden border border-white/10 flex flex-col group hover:border-emerald-500/30 transition-all">
                    <div className="relative bg-black/40 aspect-video overflow-hidden">
                      <img
                        src={imgUrl}
                        alt={`YouTube Thumbnail ${opt.label}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold border backdrop-blur-md ${opt.badgeColor}`}>
                        {opt.badge}
                      </span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="mb-4">
                        <h3 className="text-white font-bold text-sm mb-1">{opt.label}</h3>
                        <p className="text-slate-400 text-xs">{opt.desc}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => downloadImage(imgUrl, filename)}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                        >
                          <Download size={14} />
                          Download HD Image
                        </button>
                        <a
                          href={imgUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl glass text-slate-400 hover:text-white transition-colors"
                          title="View full size"
                        >
                          <Eye size={16} />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Features Grid */}
        <section className="grid sm:grid-cols-3 gap-4 mb-16">
          <div className="glass rounded-xl p-5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3">
              <Zap size={20} />
            </div>
            <h3 className="text-white font-bold text-sm mb-1.5">⚡ Instant Preview & Download</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              No server delays or waiting. Thumbnails load immediately from YouTube's direct CDN.
            </p>
          </div>
          <div className="glass rounded-xl p-5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-3">
              <Layers size={20} />
            </div>
            <h3 className="text-white font-bold text-sm mb-1.5">🎯 All Resolutions (1080p, 720p)</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Download Full HD (1920x1080), High (640x480), Standard, and Medium quality images.
            </p>
          </div>
          <div className="glass rounded-xl p-5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-3">
              <Smartphone size={20} />
            </div>
            <h3 className="text-white font-bold text-sm mb-1.5">📱 Mobile & Desktop</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Works smoothly on Android, iPhone, iPad, Windows, and Mac with zero software needed.
            </p>
          </div>
        </section>

        {/* SEO Article */}
        <article className="glass rounded-2xl p-6 sm:p-10 border border-white/10 space-y-8 mb-16 text-slate-300 text-sm sm:text-base leading-relaxed">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
              YouTube Thumbnail Download — Free HD 1080p Thumbnail Grabber
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              A YouTube thumbnail is the cover image of any video that entices viewers to click. Whether you are a content creator looking for design inspiration, a digital marketer analyzing competitors, or a fan collecting wallpaper artwork, <strong>YTTune YouTube Thumbnail Downloader</strong> lets you grab full-resolution cover photos with zero compression.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Unlike other tools that downscale images, YTTune directly queries YouTube's image servers to extract original <strong>1920x1080 MaxRes</strong> image files.
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              How to Download YouTube Thumbnails Online
            </h2>
            <ol className="list-decimal list-inside space-y-3 text-slate-300 text-sm">
              <li><strong className="text-white">Copy Video Link:</strong> Open YouTube on your browser or mobile app and copy the link of any video or Shorts.</li>
              <li><strong className="text-white">Paste URL:</strong> Paste the link into the input box above and click <em>Get YouTube Thumbnails</em>.</li>
              <li><strong className="text-white">Download in 1 Click:</strong> Pick your desired resolution (1080p, 720p, or 480p) and click <em>Download HD Image</em>.</li>
            </ol>
          </div>
        </article>

        {/* FAQs */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Frequently Asked Questions about YouTube Thumbnail Download
          </h2>
          <FAQAccordion items={THUMBNAIL_FAQS} />
        </section>

        {/* Toasts */}
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
          {toasts.map((t) => (
            <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
