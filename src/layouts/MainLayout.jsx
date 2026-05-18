import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FloatingBlobs from '../components/FloatingBlobs'
import Toast from '../components/Toast'
import { useToast } from '../hooks/useToast'
import { useTheme } from '../context/ThemeContext'

export default function MainLayout() {
  const { toasts, removeToast } = useToast()
  const { theme } = useTheme()

  return (
    <div className="min-h-screen relative" style={theme === 'dark' ? { background: '#020408' } : {}}>
      {theme === 'dark' && <FloatingBlobs />}
      <div className="relative z-10">
        <Navbar />
        <main className="pt-16">
          <Outlet />
        </main>
        <Footer />
      </div>
      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  )
}
