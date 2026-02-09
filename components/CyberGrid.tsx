"use client"

export default function CyberGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Animated grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 212, 170, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 170, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite',
        }}
      />

      {/* Scanline effect */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 212, 170, 0.03) 2px, rgba(0, 212, 170, 0.03) 4px)',
          animation: 'scanline 8s linear infinite',
        }}
      />

      {/* Corner brackets - top left */}
      <div className="absolute top-8 left-8 w-20 h-20 border-l-2 border-t-2 border-cyan-500/30" />
      <div className="absolute top-9 left-9 w-16 h-16 border-l border-t border-cyan-500/20" />

      {/* Corner brackets - top right */}
      <div className="absolute top-8 right-8 w-20 h-20 border-r-2 border-t-2 border-cyan-500/30" />
      <div className="absolute top-9 right-9 w-16 h-16 border-r border-t border-cyan-500/20" />

      {/* Corner brackets - bottom left */}
      <div className="absolute bottom-8 left-8 w-20 h-20 border-l-2 border-b-2 border-cyan-500/30" />
      <div className="absolute bottom-9 left-9 w-16 h-16 border-l border-b border-cyan-500/20" />

      {/* Corner brackets - bottom right */}
      <div className="absolute bottom-8 right-8 w-20 h-20 border-r-2 border-b-2 border-cyan-500/30" />
      <div className="absolute bottom-9 right-9 w-16 h-16 border-r border-b border-cyan-500/20" />

      {/* Animated vertical lines */}
      <div className="absolute left-1/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent animate-pulse" />
      <div className="absolute right-1/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />

      <style jsx>{`
        @keyframes gridMove {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(50px);
          }
        }

        @keyframes scanline {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
      `}</style>
    </div>
  )
}
