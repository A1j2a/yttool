import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Video,
  Download,
  CheckCircle,
  Link as LinkIcon,
  Play,
  Pause,
  Volume2,
  Maximize,
  RotateCcw,
  Music,
  X,
  FileText,
  Save,
} from "lucide-react";
import { PageWrapper } from "../animations";
import AnimatedButton from "../components/AnimatedButton";
import GlassCard from "../components/GlassCard";
import { useToast } from "../hooks/useToast";
import { useSEO } from "../hooks/useSEO";
import Toast from "../components/Toast";
import FAQAccordion from "../components/FAQAccordion";
import { API_BASE } from "../config/api";

import { isValidVideoUrl, extractVideoId } from "../utils/urlValidator";

const MP4_FAQS = [
  {
    q: "How can I download a YouTube video in MP4 format?",
    a: "Paste the YouTube video link in the box above, choose your preferred video resolution (such as 1080p Full HD or 720p HD), and click 'Convert to MP4'. Once ready, click 'Download MP4' to save the video file directly to your device.",
  },
  {
    q: "Can I download YouTube videos in 1080p with audio included?",
    a: "Yes! YTTune automatically muxes high-definition video with AAC stereo audio so you get crystal-clear 1080p and 720p MP4 videos with full sound.",
  },
  {
    q: "Does this YouTube MP4 downloader work on mobile devices?",
    a: "Absolutely. Whether you use iPhone (Safari), iPad, or an Android phone (Chrome), you can download MP4 videos directly to your camera roll or downloads folder without installing apps.",
  },
  {
    q: "Can I download YouTube Shorts as MP4 videos?",
    a: "Yes, YouTube Shorts are fully supported. Simply copy the link from the Shorts share button and paste it here to download the MP4 video without watermarks.",
  },
  {
    q: "Is YouTube video download safe and free on YTTune?",
    a: "Yes, YTTune is 100% free and safe. No malware, no popups, no account registration, and no tracking cookies are involved.",
  },
];

// ─── Resolution config ────────────────────────────────────────────────────────
const RESOLUTIONS = [
  { label: "360p", format: "360", pro: false },
  { label: "480p", format: "480", pro: false },
  { label: "720p HD", format: "720", pro: false },
  { label: "1080p FHD", format: "1080", pro: false },
  { label: "4K UHD", format: "2160", pro: true },
];

// ─── Video Player ─────────────────────────────────────────────────────────────
function VideoPlayer({ src, title, thumb }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const hideTimer = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setCurrentTime(v.currentTime);
    const onMeta = () => setDuration(v.duration);
    const onEnd = () => setPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("ended", onEnd);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("ended", onEnd);
    };
  }, [src]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.pause();
      setPlaying(false);
    } else {
      v.play();
      setPlaying(true);
    }
  };

  const seek = (e) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    v.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  };

  const changeVolume = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) videoRef.current.volume = val;
  };

  const fullscreen = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.requestFullscreen) v.requestFullscreen();
    else if (v.webkitRequestFullscreen) v.webkitRequestFullscreen();
  };

  const restart = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    setCurrentTime(0);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    if (playing)
      hideTimer.current = setTimeout(() => setShowControls(false), 2500);
  };

  const fmt = (s) => {
    if (!s || isNaN(s)) return "0:00";
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  };

  const pct = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="relative rounded-xl overflow-hidden bg-black group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={thumb}
        className="w-full max-h-72 object-contain bg-black"
        onClick={togglePlay}
        preload="metadata"
      />

      {/* Big play overlay when paused */}
      {!playing && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={togglePlay}
        >
          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all">
            <Play size={26} className="text-white ml-1" />
          </div>
        </div>
      )}

      {/* Controls bar */}
      <motion.div
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-4 pt-8 pb-3"
      >
        {/* Seek bar */}
        <div
          className="h-1 rounded-full bg-white/20 mb-3 cursor-pointer overflow-hidden"
          onClick={seek}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Restart */}
          <button
            onClick={restart}
            className="text-white/60 hover:text-white transition-colors"
          >
            <RotateCcw size={14} />
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            {playing ? (
              <Pause size={14} />
            ) : (
              <Play size={14} className="ml-0.5" />
            )}
          </button>

          {/* Time */}
          <span className="text-white/60 text-xs tabular-nums">
            {fmt(currentTime)} / {fmt(duration)}
          </span>

          <div className="flex-1" />

          {/* Volume */}
          <div className="flex items-center gap-1.5">
            <Volume2 size={13} className="text-white/60" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={changeVolume}
              className="w-16 h-1 accent-purple-400 cursor-pointer"
            />
          </div>

          {/* Fullscreen */}
          <button
            onClick={fullscreen}
            className="text-white/60 hover:text-white transition-colors"
          >
            <Maximize size={14} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const API = API_BASE;

async function convertToMp4(url, resolution) {
  const res = await fetch(`${API}/api/mp4?url=${encodeURIComponent(url)}&resolution=${resolution}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Server error ${res.status}`)
  }
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('text/html')) {
    throw new Error('Server returned invalid content. Please check backend connection.')
  }
  const title = decodeURIComponent(res.headers.get('X-Video-Title') || 'Video')
  const thumb = decodeURIComponent(res.headers.get('X-Video-Thumb') || '')
  const blob = await res.blob()
  const downloadUrl = URL.createObjectURL(blob)
  return { title, thumb, downloadUrl }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MP4Converter() {
  const [url, setUrl] = useState(() => localStorage.getItem('yt_url') || '');
  const [resolution, setResolution] = useState(RESOLUTIONS[2]); // 720p default
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  useSEO({
    title: 'YouTube Video Downloader - Download YouTube MP4 1080p, 720p HD | YTTune',
    description: 'Free YouTube video downloader online. Download YouTube videos in MP4 (1080p Full HD, 720p, 480p) fast and free. Works on Android, iPhone, Windows, and Mac.',
    keywords: 'youtube video download, youtube video mp3 mp4 download, youtube mp4 download, download youtube video, youtube video downloader, 1080p youtube video download, youtube shorts video download, youtube video downlod',
    canonical: 'https://yttune.vercel.app/mp4',
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
    if (!url.trim() || !isValidVideoUrl(url.trim())) {
      addToast("Please enter a valid YouTube or supported video URL", "error");
      return;
    }
    setStatus("loading");
    setProgress(10);
    setResult(null);
    setSaved(false);

    try {
      setProgress(30)
      const { title, thumb, downloadUrl } = await convertToMp4(url.trim(), resolution.format)
      setProgress(100)
      setResult({ title, thumb, downloadUrl })
      setStatus("done")
    } catch (err) {
      setStatus("error");
      addToast(err.message || "Conversion failed", "error");
    }
  };

  const handleDownload = () => {
    if (!result?.downloadUrl) return;
    const a = document.createElement("a");
    a.href = result.downloadUrl;
    a.download = `${(result.title || "video").replace(/[^a-z0-9]/gi, "_").toLowerCase()}_${resolution.label}.mp4`;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setSaved(true);
    addToast("Saved to your device!", "success");
  };

  const videoId = extractVideoId(url);
  const thumbUrl =
    result?.thumb ||
    (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null);

  const STEPS = [
    "Fetching URL",
    "Processing video",
    "Encoding MP4",
    "Preparing download",
  ];

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-3 sm:px-6 py-8 sm:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4">
            <Video size={28} className="text-purple-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Video to <span className="neon-text">MP4</span>
          </h1>
          <p className="text-slate-500 text-sm sm:text-base">
            Download videos in HD quality — free, no watermark, no signup.
          </p>
        </motion.div>

        {/* Format Switcher Tabs */}
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex p-1 sm:p-1.5 rounded-2xl glass bg-black/50 border border-white/10 shadow-xl gap-1 sm:gap-2 max-w-full overflow-x-auto no-scrollbar">
            <Link
              to="/mp3"
              className="flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300"
            >
              <Music size={15} className="text-slate-400 flex-shrink-0" />
              <span>MP3 Audio</span>
            </Link>
            <button
              className="flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white shadow-lg shadow-purple-500/40 ring-1 ring-purple-300/60"
            >
              <Video size={15} className="text-white flex-shrink-0" />
              <span>MP4 Video</span>
            </button>
            <Link
              to="/ai-script"
              className="flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300"
            >
              <FileText size={15} className="text-slate-400 flex-shrink-0" />
              <span>AI Script</span>
            </Link>
          </div>
        </div>

        {/* Input Card */}
        <GlassCard hover={false} className="p-6 mb-6">
          <label className="block text-slate-400 text-sm font-medium mb-2">
            Video URL
          </label>
          <div className="relative mb-5">
            <LinkIcon
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="url"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full pl-9 pr-10 py-3 rounded-xl glass border border-white/10 text-white placeholder-slate-600 text-sm bg-transparent focus:outline-none"
            />
            {url && (
              <button
                type="button"
                onClick={handleClearUrl}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                title="Clear URL"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Thumbnail preview while typing */}
          {thumbUrl && status === "idle" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-5 rounded-xl overflow-hidden relative"
            >
              <img
                src={thumbUrl}
                alt="preview"
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
                  <Play size={20} className="text-white ml-0.5" />
                </div>
              </div>
            </motion.div>
          )}

          <label className="block text-slate-400 text-sm font-medium mb-3">
            Resolution
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
            {RESOLUTIONS.map((r) => (
              <button
                key={r.label}
                onClick={() => !r.pro && setResolution(r)}
                className={`py-2.5 rounded-xl text-sm font-medium transition-all border ${
                  resolution.label === r.label
                    ? "border-purple-400/50 bg-purple-400/10 text-purple-400"
                    : r.pro
                      ? "border-white/5 text-slate-600 cursor-not-allowed"
                      : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {r.label}
                {r.pro && (
                  <span className="block text-xs text-purple-400">Pro</span>
                )}
              </button>
            ))}
          </div>

          <AnimatedButton
            onClick={handleConvert}
            disabled={status === "loading"}
            className="w-full"
          >
            <Video size={16} />
            {status === "loading" ? "Processing..." : "Download MP4"}
          </AnimatedButton>
        </GlassCard>

        {/* Progress */}
        {status === "loading" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-white text-sm font-medium">
                Processing video...
              </span>
              <span className="text-purple-400 text-sm font-bold">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
              {STEPS.map((step, i) => (
                <span
                  key={step}
                  className={`text-xs transition-colors ${progress > i * 24 ? "text-purple-400" : "text-slate-600"}`}
                >
                  {step}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Result */}
        {status === "done" && result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl overflow-hidden border border-purple-500/20"
          >
            {/* Video Player */}
            <VideoPlayer
              src={result.downloadUrl}
              title={result.title}
              thumb={thumbUrl}
            />

            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle size={18} className="text-green-400" />
                <span className="text-green-400 font-semibold text-sm">
                  Ready to Save
                </span>
                <span className="ml-auto px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs font-bold">
                  {resolution.label}
                </span>
              </div>
              <p className="text-white font-medium text-sm truncate mb-1">
                {result.title}
              </p>
              <p className="text-slate-500 text-xs mb-4">
                MP4 • {resolution.label}
              </p>

              <AnimatedButton
                className={`w-full flex items-center justify-center gap-2 ${
                  saved
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                }`}
                onClick={handleDownload}
              >
                {saved ? (
                  <>
                    <CheckCircle size={18} />
                    Saved to Device
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save MP4 to Device
                  </>
                )}
              </AnimatedButton>
            </div>
          </motion.div>
        )}

        {/* Error */}
        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-5 border border-red-500/20 text-center"
          >
            <p className="text-red-400 font-medium mb-1">Conversion failed</p>
            <p className="text-slate-500 text-sm mb-4">
              Server waking up or video unavailable. Please wait 30 seconds and try again.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="text-purple-400 text-sm hover:underline"
            >
              Try again
            </button>
          </motion.div>
        )}

        {/* Semantic SEO Content Section */}
        <section className="mt-16 pt-12 border-t border-white/5 space-y-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              YouTube Video Download — Free MP4 Downloader in 1080p &amp; 720p HD
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4 text-sm sm:text-base">
              YTTune provides the easiest and fastest web application for <strong className="text-white">YouTube video download</strong>. Save your favorite YouTube tutorials, music clips, gaming streams, and vlogs directly as high-definition MP4 files. Choose between 1080p Full HD, 720p HD, and mobile-friendly 480p/360p video with crystal-clear synced sound.
            </p>
            <p className="text-slate-400 leading-relaxed text-sm">
              Our cloud downloader bypasses speed throttles to deliver maximum download rates directly to your browser. You don't need to register, configure proxies, or install shady third-party plugins.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="glass rounded-xl p-5 border border-white/10">
              <h3 className="text-white font-bold mb-2">🎬 1080p Full HD Video</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Save videos in crisp 1080p FHD and 720p HD with synced audio.</p>
            </div>
            <div className="glass rounded-xl p-5 border border-white/10">
              <h3 className="text-white font-bold mb-2">⚡ No Speed Limits</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Enjoy direct, unrestricted download speeds directly from our fast servers.</p>
            </div>
            <div className="glass rounded-xl p-5 border border-white/10">
              <h3 className="text-white font-bold mb-2">📱 YouTube Shorts Ready</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Save YouTube Shorts in vertical MP4 format without annoying watermarks.</p>
            </div>
          </div>

          {/* How to Guide */}
          <div className="glass rounded-2xl p-6 sm:p-8 border border-white/10 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              How to Download YouTube Videos in MP4 Online
            </h2>
            <ol className="list-decimal list-inside space-y-3 text-slate-300 text-sm">
              <li><strong className="text-white">Copy Video Link:</strong> Navigate to YouTube and copy the link from the address bar or share sheet.</li>
              <li><strong className="text-white">Paste URL:</strong> Paste the link into YTTune's input bar above.</li>
              <li><strong className="text-white">Select Resolution:</strong> Pick 1080p FHD, 720p HD, or 480p depending on your storage needs.</li>
              <li><strong className="text-white">Download Video:</strong> Click &quot;Convert to MP4&quot; and save the resulting MP4 video directly to your device.</li>
            </ol>
          </div>

          {/* MP4 FAQs */}
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              YouTube Video Download — FAQs
            </h2>
            <FAQAccordion faqs={MP4_FAQS} />
          </div>
        </section>
      </div>
      <Toast toasts={toasts} removeToast={removeToast} />
    </PageWrapper>
  );
}
