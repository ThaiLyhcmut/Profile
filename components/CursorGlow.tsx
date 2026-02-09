"use client"

import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`
        glowRef.current.style.top = `${e.clientY}px`
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      ref={glowRef}
      className="fixed w-[600px] h-[600px] pointer-events-none z-50 transition-transform duration-300 ease-out"
      style={{
        background: 'radial-gradient(circle, rgba(0,212,170,0.15) 0%, transparent 70%)',
        transform: 'translate(-50%, -50%)',
        mixBlendMode: 'screen',
      }}
    />
  )
}
