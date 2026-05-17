export const NAV_LINKS = [
  { label: 'Tools', path: '/tools' },
  { label: 'MP3', path: '/mp3' },
  { label: 'MP4', path: '/mp4' },
  { label: 'AI Script', path: '/ai-script' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
]

export const TOOLS = [
  { id: 1, name: 'Video to MP3', desc: 'Extract audio from any video URL instantly', icon: 'Music', category: 'Audio', path: '/mp3', trending: true, color: '#00f5ff' },
  { id: 2, name: 'Video to MP4', desc: 'Download videos in HD quality from any platform', icon: 'Video', category: 'Video', path: '/mp4', trending: true, color: '#bf00ff' },
  { id: 3, name: 'AI Script Writer', desc: 'Generate professional scripts with AI', icon: 'Sparkles', category: 'AI', path: '/ai-script', trending: true, color: '#ff0080' },
  { id: 4, name: 'URL Downloader', desc: 'Download media from 1000+ websites', icon: 'Download', category: 'Download', path: '/tools', trending: false, color: '#00ff88' },
  { id: 5, name: 'Image Compressor', desc: 'Compress images without quality loss', icon: 'Image', category: 'Image', path: '/tools', trending: false, color: '#ff6b35' },
  { id: 6, name: 'Text to Speech', desc: 'Convert text to natural AI voice', icon: 'Mic', category: 'AI', path: '/tools', trending: true, color: '#00f5ff' },
  { id: 7, name: 'PDF Converter', desc: 'Convert documents to any format', icon: 'FileText', category: 'Document', path: '/tools', trending: false, color: '#bf00ff' },
  { id: 8, name: 'QR Generator', desc: 'Create custom QR codes instantly', icon: 'QrCode', category: 'Utility', path: '/tools', trending: false, color: '#ff0080' },
  { id: 9, name: 'Color Palette', desc: 'Generate stunning color palettes with AI', icon: 'Palette', category: 'Design', path: '/tools', trending: false, color: '#00ff88' },
  { id: 10, name: 'Code Formatter', desc: 'Format and beautify your code', icon: 'Code', category: 'Dev', path: '/tools', trending: false, color: '#ff6b35' },
  { id: 11, name: 'Subtitle Generator', desc: 'Auto-generate subtitles from video', icon: 'Captions', category: 'Video', path: '/tools', trending: true, color: '#00f5ff' },
  { id: 12, name: 'Thumbnail Maker', desc: 'Create viral thumbnails with AI', icon: 'LayoutTemplate', category: 'Design', path: '/tools', trending: false, color: '#bf00ff' },
]

export const CATEGORIES = ['All', 'Audio', 'Video', 'AI', 'Download', 'Image', 'Document', 'Utility', 'Design', 'Dev']

export const FEATURES = [
  { icon: 'Zap', title: 'Lightning Fast', desc: 'Process media in seconds with our optimized cloud infrastructure.' },
  { icon: 'Shield', title: 'Privacy First', desc: 'Your files are never stored. All processing happens in real-time.' },
  { icon: 'Globe', title: '1000+ Sources', desc: 'Download from YouTube, Vimeo, TikTok, Instagram, and more.' },
  { icon: 'Cpu', title: 'AI Powered', desc: 'Advanced AI models for script generation and content creation.' },
  { icon: 'Layers', title: '50+ Tools', desc: 'Everything you need in one unified platform.' },
  { icon: 'RefreshCw', title: 'Always Updated', desc: 'New tools added weekly based on community requests.' },
]

export const STATS = [
  { value: '12M+', label: 'Files Processed' },
  { value: '850K+', label: 'Active Users' },
  { value: '50+', label: 'Premium Tools' },
  { value: '99.9%', label: 'Uptime' },
]

export const PRICING = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    color: '#00f5ff',
    features: ['5 conversions/day', '720p max quality', '10 AI script credits', 'Basic tools access', 'Community support'],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/month',
    color: '#bf00ff',
    features: ['Unlimited conversions', '4K quality downloads', '500 AI script credits', 'All 50+ tools', 'Priority support', 'No watermarks', 'API access'],
    cta: 'Start Pro Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$49',
    period: '/month',
    color: '#ff0080',
    features: ['Everything in Pro', 'Team workspace', 'Custom integrations', 'Dedicated support', 'SLA guarantee', 'White-label option', 'Unlimited API calls'],
    cta: 'Contact Sales',
    popular: false,
  },
]

export const TESTIMONIALS = [
  { name: 'Sarah Chen', role: 'Content Creator', avatar: 'SC', text: 'NexaTools completely changed my workflow. I save 3+ hours every week just on video conversions alone.', rating: 5 },
  { name: 'Marcus Rivera', role: 'YouTuber', avatar: 'MR', text: 'The AI script generator is insane. It writes better hooks than I do. My views went up 40% in a month.', rating: 5 },
  { name: 'Priya Sharma', role: 'Digital Marketer', avatar: 'PS', text: 'Having 50+ tools in one place is a game changer. No more juggling 10 different subscriptions.', rating: 5 },
  { name: 'Jake Thompson', role: 'Podcast Host', avatar: 'JT', text: 'The MP3 converter quality is unmatched. Crystal clear audio every single time.', rating: 5 },
]

export const FAQS = [
  { q: 'Is NexaTools really free to use?', a: 'Yes! Our free tier gives you 5 conversions per day and access to basic tools. Upgrade to Pro for unlimited access.' },
  { q: 'Which video platforms are supported?', a: 'We support 1000+ platforms including YouTube, Vimeo, TikTok, Instagram, Twitter, Facebook, Dailymotion, and many more.' },
  { q: 'Are my files stored on your servers?', a: 'Never. All processing is done in real-time and files are immediately discarded after conversion. Your privacy is our priority.' },
  { q: 'What quality options are available?', a: 'Free users get up to 720p. Pro users get up to 4K resolution for video and 320kbps for audio.' },
  { q: 'Can I use NexaTools for commercial projects?', a: 'Pro and Enterprise plans include commercial usage rights. Please review our terms for specific use cases.' },
  { q: 'How does the AI script generator work?', a: 'Our AI uses advanced language models to generate scripts based on your topic, tone, and length preferences.' },
]

export const TEAM = [
  { name: 'Alex Nova', role: 'CEO & Founder', avatar: 'AN', bio: 'Former Google engineer with 10+ years in media tech.' },
  { name: 'Luna Park', role: 'CTO', avatar: 'LP', bio: 'AI researcher and full-stack architect.' },
  { name: 'Kai Osei', role: 'Head of Design', avatar: 'KO', bio: 'Award-winning UX designer from Berlin.' },
  { name: 'Zara Mills', role: 'Head of AI', avatar: 'ZM', bio: 'PhD in Machine Learning from MIT.' },
]

export const AI_TONES = ['Professional', 'Casual', 'Humorous', 'Inspirational', 'Educational', 'Persuasive']
export const AI_TYPES = ['YouTube Script', 'Blog Post', 'Ad Copy', 'Social Caption', 'Email Newsletter', 'Product Description']

export const AUDIO_QUALITIES = ['128 kbps', '192 kbps', '256 kbps', '320 kbps (Pro)']
export const VIDEO_RESOLUTIONS = ['360p', '480p', '720p HD', '1080p FHD', '4K UHD (Pro)']
