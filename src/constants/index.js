export const NAV_LINKS = [
  { label: "Video Download", path: "/mp4" },
  { label: "Audio Convert", path: "/mp3" },
  { label: "Shorts", path: "/shorts" },
  { label: "Thumbnail", path: "/thumbnail" },
  { label: "AI Script", path: "/ai-script" },
  { label: "Tools", path: "/tools" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

export const TOOLS = [
  {
    id: 1,
    name: "Video to MP3",
    desc: "Extract audio from any YouTube video instantly — free",
    icon: "Music",
    category: "Audio",
    path: "/mp3",
    trending: true,
    color: "#00f5ff",
  },
  {
    id: 2,
    name: "YouTube Video Download",
    desc: "Download YouTube videos in HD quality — free",
    icon: "Video",
    category: "Video",
    path: "/mp4",
    trending: true,
    color: "#bf00ff",
  },
  {
    id: 3,
    name: "YouTube Shorts Download",
    desc: "Download YouTube Shorts in 1080p Full HD MP4 or MP3 — free",
    icon: "Smartphone",
    category: "Video",
    path: "/shorts",
    trending: true,
    color: "#ff007f",
  },
  {
    id: 4,
    name: "Thumbnail Downloader",
    desc: "Extract & download YouTube thumbnails in 1080p HD — free",
    icon: "Image",
    category: "Image",
    path: "/thumbnail",
    trending: true,
    color: "#10b981",
  },
  {
    id: 5,
    name: "AI Script Writer",
    desc: "Copy YouTube video scripts with AI — free",
    icon: "Sparkles",
    category: "AI",
    path: "/ai-script",
    trending: true,
    color: "#ff0080",
  },
];
  // { id: 5, name: 'Image Compressor', desc: 'Compress images without quality loss', icon: 'Image', category: 'Image', path: '/tools', trending: false, color: '#ff6b35' },
  // { id: 6, name: 'Text to Speech', desc: 'Convert text to natural AI voice', icon: 'Mic', category: 'AI', path: '/tools', trending: true, color: '#00f5ff' },
  // { id: 7, name: 'PDF Converter', desc: 'Convert documents to any format', icon: 'FileText', category: 'Document', path: '/tools', trending: false, color: '#bf00ff' },
  // { id: 8, name: 'QR Generator', desc: 'Create custom QR codes instantly', icon: 'QrCode', category: 'Utility', path: '/tools', trending: false, color: '#ff0080' },
  // { id: 9, name: 'Color Palette', desc: 'Generate stunning color palettes with AI', icon: 'Palette', category: 'Design', path: '/tools', trending: false, color: '#00ff88' },
  // { id: 10, name: 'Code Formatter', desc: 'Format and beautify your code', icon: 'Code', category: 'Dev', path: '/tools', trending: false, color: '#ff6b35' },
  // { id: 11, name: 'Subtitle Generator', desc: 'Auto-generate subtitles from video', icon: 'Captions', category: 'Video', path: '/tools', trending: true, color: '#00f5ff' },
  // { id: 12, name: 'Thumbnail Maker', desc: 'Create viral thumbnails with AI', icon: 'LayoutTemplate', category: 'Design', path: '/tools', trending: false, color: '#bf00ff' },

export const CATEGORIES = [
  "All",
  "Audio",
  "Video",
  "Image",
  "AI",
];

export const FEATURES = [
  {
    icon: "Zap",
    title: "Instant Cloud Processing",
    desc: "Direct stream extraction processes your media in seconds without waiting in long queues.",
  },
  {
    icon: "Shield",
    title: "Privacy & Zero Logging",
    desc: "Files are converted on-the-fly and immediately removed. We never store your downloads or history.",
  },
  {
    icon: "Headphones",
    title: "High-Fidelity Audio",
    desc: "Extract clean MP3 audio up to 320 kbps with embedded video title and thumbnail metadata.",
  },
  {
    icon: "Video",
    title: "Full HD Video & Shorts",
    desc: "Download videos and vertical YouTube Shorts in crisp 1080p and 720p MP4 without watermarks.",
  },
  {
    icon: "Smartphone",
    title: "Cross-Device Compatibility",
    desc: "Works natively in your browser across Android, iPhone, iPad, Mac, and Windows with no apps required.",
  },
  {
    icon: "Sparkles",
    title: "AI Script Extraction",
    desc: "Grab complete video transcripts, descriptions, and SEO tags with one click for research and remixing.",
  },
];

export const STATS = [
  { value: "320 kbps", label: "Max Audio Fidelity" },
  { value: "1080p FHD", label: "Video Resolution" },
  { value: "100% Free", label: "No Signup Required" },
  { value: "Zero", label: "Watermarks Added" },
];

export const TESTIMONIALS = [
  {
    name: "Devin Ross",
    role: "Video Editor",
    avatar: "DR",
    text: "The audio extraction is clean and preserves 320kbps fidelity. It cut down sample hunting time significantly.",
    rating: 5,
  },
  {
    name: "Amina Yusuf",
    role: "Content Creator",
    avatar: "AY",
    text: "Downloading Shorts and grabbing accurate transcripts for translation takes seconds. Exactly what I needed.",
    rating: 5,
  },
  {
    name: "Carlos Mendez",
    role: "Podcast Producer",
    avatar: "CM",
    text: "No annoying redirects, no ads cluttering the page, and fast conversions. Clean and dependable utility.",
    rating: 5,
  },
  {
    name: "Rohan Patel",
    role: "Digital Marketer",
    avatar: "RP",
    text: "Extracting video tags and descriptions directly into my workflow saves me so much research time.",
    rating: 5,
  },
];

export const FAQS = [
  {
    q: "Is YTTune completely free to use?",
    a: "Yes. YTTune is 100% free with no account creation, no subscription plans, and no hidden fees.",
  },
  {
    q: "What types of YouTube content are supported?",
    a: "You can convert standard YouTube videos, YouTube Shorts, music tracks, and podcast episodes using any valid public YouTube link.",
  },
  {
    q: "Are downloaded files stored on your servers?",
    a: "No. Conversion occurs in temporary memory, streamed straight to your browser, and deleted immediately after the download starts.",
  },
  {
    q: "What quality formats can I choose from?",
    a: "For audio, you can download MP3s up to 320 kbps. For video, resolutions include 1080p Full HD, 720p HD, and 480p standard quality.",
  },
  {
    q: "Does YTTune add watermarks to downloaded videos?",
    a: "Never. All downloaded MP4 files and converted MP3 tracks are clean and retain the original quality without branding.",
  },
  {
    q: "How does the AI Script / Transcript tool work?",
    a: "It extracts the official closed captions, timestamps, description, and metadata directly from the video so you can read, copy, or repurpose the content.",
  },
];

export const AUDIO_QUALITIES = [
  "128 kbps",
  "192 kbps",
  "256 kbps",
  "320 kbps",
];

export const VIDEO_RESOLUTIONS = [
  "360p",
  "480p",
  "720p HD",
  "1080p FHD",
];
