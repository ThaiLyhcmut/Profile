"use client"

import { useEffect, useRef } from 'react'

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Katakana + số + ký tự kiểu hacker cho cảm giác cyber
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF<>=*+-#@%'.split('')
    const fontSize = 16
    let columns = 0
    let drops: number[] = []

    const setup = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      columns = Math.floor(window.innerWidth / fontSize)
      drops = new Array(columns).fill(0).map(() => Math.random() * -100)
    }
    setup()

    let rafId = 0
    let last = 0
    const stepMs = 55 // tốc độ rơi (càng lớn càng chậm, nhẹ máy)

    const draw = (now: number) => {
      rafId = requestAnimationFrame(draw)
      if (now - last < stepMs) return
      last = now

      // Lớp phủ mờ tạo vệt đuôi mờ dần
      ctx.fillStyle = 'rgba(2, 6, 23, 0.08)'
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = chars[(Math.random() * chars.length) | 0]
        const x = i * fontSize
        const y = drops[i] * fontSize

        // Ký tự dẫn đầu sáng trắng-xanh, đuôi xanh cyber
        ctx.fillStyle = Math.random() > 0.985 ? '#d1fff4' : '#00d4aa'
        ctx.fillText(text, x, y)

        if (y > window.innerHeight && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }
    rafId = requestAnimationFrame(draw)

    window.addEventListener('resize', setup)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', setup)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-[0.13]"
    />
  )
}
