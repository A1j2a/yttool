import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import MainLayout from "./layouts/MainLayout";
import Landing from "./pages/Landing";
import Tools from "./pages/Tools";
import MP3Converter from "./pages/MP3Converter";
import MP4Converter from "./pages/MP4Converter";
import AIScript from "./pages/AIScript";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";

export default function App() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/mp3" element={<MP3Converter />} />
          <Route path="/mp4" element={<MP4Converter />} />
          <Route path="/ai-script" element={<AIScript />} />
          {/* <Route path="/pricing" element={<Pricing />} /> */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
