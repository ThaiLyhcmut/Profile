"use client"

import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let rafId = 0
    let x = 0
    let y = 0
    let pending = false

    const render = () => {
      pending = false
      if (glowRef.current) {
        // translate3d -> GPU compositing, không gây reflow như left/top
        glowRef.current.style.transform = `translate3d(${x - 300}px, ${y - 300}px, 0)`
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      x = e.clientX
      y = e.clientY
      if (!pending) {
        pending = true
        rafId = requestAnimationFrame(render)
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      ref={glowRef}
      className="fixed left-0 top-0 w-[600px] h-[600px] pointer-events-none z-50 will-change-transform"
      style={{
        background: 'radial-gradient(circle, rgba(0,212,170,0.12) 0%, transparent 70%)',
        mixBlendMode: 'screen',
      }}
    />
  )
}
