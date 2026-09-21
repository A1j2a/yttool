
// Redirect legacy deployment URL if accessed directly
if (typeof window !== "undefined" && window.location.hostname.includes("youtube-mp3-converter-mu.vercel.app")) {
  window.location.replace("https://yttune.vercel.app" + window.location.pathname + window.location.search);
}

import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import MainLayout from "./layouts/MainLayout";
import Landing from "./pages/Landing";
import Tools from "./pages/Tools";
import MP3Converter from "./pages/MP3Converter";
import MP4Converter from "./pages/MP4Converter";
import AIScript from "./pages/AIScript";
import ShortsDownloader from "./pages/ShortsDownloader";
import ThumbnailDownloader from "./pages/ThumbnailDownloader";
import About from "./pages/About";
import Contact from "./pages/Contact";

const BlogYoutubeToMp3    = lazy(() => import("./pages/BlogYoutubeToMp3"));
const BlogDownloadShorts  = lazy(() => import("./pages/BlogDownloadShorts"));
const BlogBestDownloader  = lazy(() => import("./pages/BlogBestDownloader"));

export default function App() {
  const location = useLocation();
  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/mp3" element={<MP3Converter />} />
            <Route path="/mp4" element={<MP4Converter />} />
            <Route path="/shorts" element={<ShortsDownloader />} />
            <Route path="/youtube-shorts-downloader" element={<ShortsDownloader />} />
            <Route path="/thumbnail" element={<ThumbnailDownloader />} />
            <Route path="/youtube-thumbnail-downloader" element={<ThumbnailDownloader />} />
            <Route path="/ai-script" element={<AIScript />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog/youtube-to-mp3" element={<Suspense fallback={null}><BlogYoutubeToMp3 /></Suspense>} />
            <Route path="/blog/download-youtube-shorts" element={<Suspense fallback={null}><BlogDownloadShorts /></Suspense>} />
            <Route path="/blog/best-youtube-downloader" element={<Suspense fallback={null}><BlogBestDownloader /></Suspense>} />
          </Route>
        </Routes>
      </AnimatePresence>
      <Analytics />
    </>
  );
}
