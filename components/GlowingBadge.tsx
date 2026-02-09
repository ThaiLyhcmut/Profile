"use client"

import { motion } from 'framer-motion'

interface GlowingBadgeProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
}

export default function GlowingBadge({ children, className = '', glowColor = 'cyan' }: GlowingBadgeProps) {
  const colors = {
    cyan: 'shadow-cyan-500/50',
    blue: 'shadow-blue-500/50',
    green: 'shadow-green-500/50',
    purple: 'shadow-purple-500/50',
    orange: 'shadow-orange-500/50',
    pink: 'shadow-pink-500/50',
  }

  return (
    <motion.span
      className={`inline-block relative ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className={`relative z-10`}>{children}</span>
      <motion.span
        className={`absolute inset-0 rounded-lg blur-sm ${colors[glowColor as keyof typeof colors]}`}
        style={{
          background: 'currentColor',
          opacity: 0.3,
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.span>
  )
}
