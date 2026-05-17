export default function FloatingBlobs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="blob w-96 h-96 bg-cyan-500 top-[-10%] left-[-5%] animate-float" />
      <div className="blob w-80 h-80 bg-purple-600 top-[30%] right-[-8%] animate-float" style={{ animationDelay: '2s' }} />
      <div className="blob w-64 h-64 bg-pink-500 bottom-[10%] left-[20%] animate-float" style={{ animationDelay: '4s' }} />
      <div className="blob w-48 h-48 bg-cyan-400 bottom-[30%] right-[30%] animate-float" style={{ animationDelay: '1s' }} />
    </div>
  )
}
