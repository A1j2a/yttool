import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FloatingBlobs from '../components/FloatingBlobs'
import Toast from '../components/Toast'
import { useToast } from '../hooks/useToast'

export default function MainLayout() {
  const [darkMode, setDarkMode] = useState(true)
  const { toasts, removeToast } = useToast()

  return (
    <div className={`min-h-screen relative ${darkMode ? 'dark' : ''}`} style={{ background: '#020408' }}>
      <FloatingBlobs />
      <div className="relative z-10">
        <Navbar darkMode={darkMode} toggleDark={() => setDarkMode(!darkMode)} />
        <main className="pt-16">
          <Outlet />
        </main>
        <Footer />
      </div>
      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  )
}
