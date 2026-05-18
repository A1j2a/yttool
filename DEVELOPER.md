# YTTune — Developer Documentation

## Overview
YTTune is a free YouTube utility web app built with **React + Vite** (frontend) and **Express.js** (backend proxy server). It provides 3 core tools: Video to MP3 conversion, YouTube video download, and YouTube script/transcript extraction.

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 19, Vite 8, Tailwind CSS v4   |
| Animation | Framer Motion                       |
| Icons     | Lucide React                        |
| Routing   | React Router DOM v7                 |
| Backend   | Express.js (proxy server)           |
| Email     | EmailJS (`@emailjs/browser`)        |
| Security  | Helmet, express-rate-limit, CORS    |

---

## Project Structure

```
yttool/
├── src/
│   ├── animations/        # Framer Motion page wrapper & variants
│   ├── components/        # Reusable UI components
│   ├── constants/         # Nav links, tools list, FAQs, stats data
│   ├── context/           # ThemeContext (dark mode fixed)
│   ├── hooks/             # useToast, useSEO custom hooks
│   ├── layouts/           # MainLayout (Navbar + Footer wrapper)
│   ├── pages/             # All route pages
│   └── utils/             # URL validator utility
├── server.js              # Express proxy backend
├── .env                   # Environment variables (local)
├── .env.example           # Template for new developers
├── .env.production        # Production env values
├── vite.config.js         # Vite config
└── package.json
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Run frontend + backend together
npm run dev

# Run only backend
npm run server

# Production build
npm run build
```

> Requires Node.js v20.19+ or v22.12+

---

## Environment Variables

### Local — `.env`

```env
# Backend server URL (local)
VITE_API_URL=http://localhost:3001

# Loader.to conversion API base URLs
VITE_LOADER_START=https://loader.to/ajax/download.php
VITE_LOADER_PROGRESS=https://p.savenow.to/api/progress

# EmailJS — used in Contact.jsx for sending emails
VITE_EMAILJS_SERVICE_ID=service_70oi7ak
VITE_EMAILJS_TEMPLATE_ID=template_ox6hedy
VITE_EMAILJS_PUBLIC_KEY=22h5yZPs7KvEtXzDc
```

### Production — `.env.example` (template for new devs)

```env
VITE_API_URL=https://your-backend.onrender.com
VITE_LOADER_START=https://loader.to/ajax/download.php
VITE_LOADER_PROGRESS=https://p.savenow.to/api/progress
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

> `VITE_` prefix required for Vite to expose variables to frontend via `import.meta.env.*`

---

## External APIs Used

| API | Used In | Purpose |
|-----|---------|---------|
| `https://loader.to/ajax/download.php` | `server.js → /api/convert` | Start MP3/MP4 conversion job, returns job `id` |
| `https://p.savenow.to/api/progress?id=` | `server.js → /api/progress` | Poll conversion progress, returns `download_url` when done |
| `youtube.com/watch?v=` (HTML scrape) | `server.js → /api/yt-info` | Extract transcript (captionTracks), description, tags |
| EmailJS SDK | `Contact.jsx` | Send contact form email directly from browser — no backend |

---

## API Flow Details

### MP3 / MP4 Conversion

```
1. User pastes YouTube URL → clicks Convert
2. Frontend → GET /api/convert?url=...&format=mp3
3. server.js → POST loader.to API → returns { id, success }
4. Frontend polls → GET /api/progress?id=...  (every 1.5s)
5. server.js → GET p.savenow.to/api/progress?id=... → returns { progress }
6. When progress = 1000 → download_url is ready
7. Frontend → GET /api/stream?url=<download_url>
8. server.js proxies the audio/video stream → user downloads file
```

### YouTube Script Extractor

```
1. User pastes YouTube URL → clicks Extract
2. Frontend → GET /api/yt-info?url=...
3. server.js scrapes youtube.com HTML page
   - Finds "captionTracks" in ytInitialPlayerResponse JSON
   - Fetches caption XML → parses <text> tags → joins as full transcript
   - Extracts <meta name="keywords"> → tags array
   - Extracts description from ytInitialData or <meta name="description">
4. Returns { videoId, transcript, description, tags }
5. Frontend shows 3 tabs: Transcript | Description | Tags
```

### Contact Form (EmailJS)

```
1. User fills form → frontend validates (name, email, message required)
2. emailjs.send(SERVICE_ID, TEMPLATE_ID, { from_name, from_email, subject, message }, PUBLIC_KEY)
3. EmailJS sends email directly from browser → no backend call
4. Template variables used: {{from_name}}, {{from_email}}, {{subject}}, {{message}}
```

---

## Backend — `server.js`

Express proxy running on **port 3001**. All routes under `/api`.

| Endpoint        | Method | Description |
|-----------------|--------|-------------|
| `/api/convert`  | GET    | Start MP3/MP4 conversion via loader.to |
| `/api/progress` | GET    | Poll conversion progress by job `id` |
| `/api/stream`   | GET    | Proxy audio/video stream to avoid CORS |
| `/api/yt-info`  | GET    | Fetch transcript, description & tags |
| `/health`       | GET    | Health check — returns `{ status: 'ok' }` |

**Security:**
- `helmet` — secure HTTP headers
- `cors` — restricts to allowed origins in production
- `express-rate-limit` — 30 requests/min per IP
- YouTube URL regex validation before any processing

---

## Frontend Pages

### `/` — Landing
Hero section with URL input, stats, 3 tool cards, features, testimonials, FAQ, CTA banner. Pricing section commented out (future phase).

### `/mp3` — MP3 Converter
Paste YouTube URL → convert → poll progress → download MP3.

### `/mp4` — Video Download
Same flow as MP3 with `format=mp4`. Supports quality selection.

### `/ai-script` — Script Extractor
Paste YouTube URL → fetch → 3 tabs (Transcript, Description, Tags) with Copy buttons.

### `/tools` — Tools Page
Lists 3 active tools. Extra tools commented out for future phases.

### `/contact` — Contact Form
Full validation + EmailJS integration. Fields: Name, Email, Subject, Message.

### `/about` — About Page
Team info and platform description.

### `/blog/*` — Blog Pages (lazy loaded)
- `/blog/youtube-to-mp3`
- `/blog/download-youtube-shorts`
- `/blog/best-youtube-downloader`

---

## Key Components

| Component       | Description |
|-----------------|-------------|
| `Navbar.jsx`    | Fixed top nav, mobile sidebar, dark theme fixed |
| `MainLayout.jsx`| Wraps all pages with Navbar + Footer + FloatingBlobs |
| `AnimatedButton`| Reusable gradient button with hover animation |
| `GlassCard`     | Glassmorphism card container |
| `Toast.jsx`     | Success/error notifications via `useToast` hook |
| `FloatingBlobs` | Decorative animated background blobs |
| `ToolCard`      | Tool card on landing/tools page |
| `FAQAccordion`  | Expandable FAQ section |

---

## Navigation Order

```
Video Download → Audio Convert → AI Script → Tools → About → Contact
```

---

## EmailJS Setup (for new developer)

1. Create account at [emailjs.com](https://www.emailjs.com)
2. Add Email Service (Gmail etc.) → copy `Service ID`
3. Create Template with: `{{from_name}}`, `{{from_email}}`, `{{subject}}`, `{{message}}` → copy `Template ID`
4. Account → API Keys → copy `Public Key`
5. Add all 3 to `.env`

---

## Deployment

- **Frontend** — Vercel (`vercel.json` included)
- **Backend** — Render (`render.yaml` included)
- Set `FRONTEND_URL` on Render to your Vercel domain for CORS

---

## What's Commented Out (Future Phase)

- Pricing page & section (`/pricing` route)
- Extra tools (Image Compressor, PDF Converter, QR Generator, Text to Speech, etc.)
- "View All Tools" button on landing
- Support cards on Contact page
