"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Sparkles } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface AICharacterProps {
  onOpenChat: () => void
}

export default function AICharacter({ onOpenChat }: AICharacterProps) {
  // Limited area in bottom-left corner (expanded vertical range)
  const areaLimits = {
    minX: 20,
    maxX: 280,
    minY: 60,   // Lower (higher on screen)
    maxY: 250,  // Higher (lower on screen)
  }

  const [position, setPosition] = useState({ x: 50, y: 120 })
  const [targetPosition, setTargetPosition] = useState({ x: 200, y: 150 })
  const [isWalking, setIsWalking] = useState(true)
  const [showBubble, setShowBubble] = useState(false)
  const [direction, setDirection] = useState<'right' | 'left'>('right')
  const { language } = useLanguage()

  const messages = language === 'vi'
    ? [
        'Xin chào! 👋',
        'Cần giúp gì không?',
        'Click vào tôi!',
        'Hỏi tôi về Thai!',
        'Tôi là trợ lý của Thai 🤖',
        'Nếu cần thêm thông tin gì, liên hệ tôi nhé!',
        'Thai đang làm gì vậy?',
        'Chat với tôi đi! 💬',
      ]
    : [
        'Hello! 👋',
        'Need help?',
        'Click me!',
        'Ask me about Thai!',
        "I'm Thai's assistant 🤖",
        'Contact me if you need any info!',
        "What's Thai working on?",
        "Let's chat! 💬",
      ]

  const [currentMessage, setCurrentMessage] = useState(messages[0])

  // Generate random target within area
  const getRandomTarget = () => ({
    x: Math.random() * (areaLimits.maxX - areaLimits.minX) + areaLimits.minX,
    y: Math.random() * (areaLimits.maxY - areaLimits.minY) + areaLimits.minY,
  })

  useEffect(() => {
    let animationFrame: number
    let lastTime = Date.now()
    const speed = 1.2

    const animate = () => {
      const currentTime = Date.now()
      const deltaTime = currentTime - lastTime
      lastTime = currentTime

      setPosition((prev) => {
        const dx = targetPosition.x - prev.x
        const dy = targetPosition.y - prev.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Reached target
        if (distance < 5) {
          // Stop and show bubble
          setIsWalking(false)
          setShowBubble(true)

          setTimeout(() => {
            setShowBubble(false)
            setTargetPosition(getRandomTarget())
            setIsWalking(true)
          }, 3000)

          return prev
        }

        // Move towards target
        const moveX = (dx / distance) * speed * (deltaTime / 16)
        const moveY = (dy / distance) * speed * (deltaTime / 16)

        // Update direction based on movement
        setDirection(dx > 0 ? 'right' : 'left')

        return {
          x: prev.x + moveX,
          y: prev.y + moveY,
        }
      })

      if (isWalking) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    if (isWalking) {
      animationFrame = requestAnimationFrame(animate)
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [isWalking, targetPosition])

  // Change message periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(messages[Math.floor(Math.random() * messages.length)])
    }, 5000)
    return () => clearInterval(interval)
  }, [language])

  return (
    <>
      <motion.div
        className="fixed z-40 cursor-pointer"
        style={{
          left: position.x,
          bottom: position.y,
          transform: direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
        }}
        onClick={onOpenChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {/* Speech Bubble - Counter-flip to keep text readable */}
        <AnimatePresence>
          {showBubble && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.8 }}
              className="absolute -top-16 bg-white text-slate-900 px-4 py-2 rounded-2xl rounded-bl-none shadow-xl border-2 border-cyan-400 whitespace-nowrap"
              style={{
                left: '50%',
                // Counter-flip: if character is flipped, flip bubble back to keep text normal
                transform: `translateX(-50%) scaleX(${direction === 'left' ? -1 : 1})`,
              }}
            >
              <div>
                {currentMessage}
              </div>
              <motion.div
                className="absolute -top-1 right-4"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles size={16} className="text-cyan-500" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Robot Character */}
        <div className="relative">
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />

          {/* Robot Body */}
          <svg width="120" height="140" viewBox="0 0 120 140" className="relative">
            {/* Antenna */}
            <motion.g
              animate={isWalking ? {
                rotate: [0, -5, 5, 0],
              } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
              style={{ transformOrigin: '60px 15px' }}
            >
              <line x1="60" y1="5" x2="60" y2="15" stroke="#00d4aa" strokeWidth="2" />
              <circle cx="60" cy="3" r="3" fill="#00d4aa">
                <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
              </circle>
            </motion.g>

            {/* Head */}
            <rect x="40" y="15" width="40" height="35" rx="8" fill="url(#headGradient)" stroke="#00d4aa" strokeWidth="2" />
            <defs>
              <linearGradient id="headGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>

            {/* Eyes */}
            <motion.g
              animate={{
                scaleY: [1, 0.1, 1],
              }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            >
              <rect x="48" y="25" width="8" height="8" rx="2" fill="#00d4aa">
                <animate attributeName="fill" values="#00d4aa;#0ea5e9;#00d4aa" dur="2s" repeatCount="indefinite" />
              </rect>
              <rect x="64" y="25" width="8" height="8" rx="2" fill="#00d4aa">
                <animate attributeName="fill" values="#00d4aa;#0ea5e9;#00d4aa" dur="2s" repeatCount="indefinite" />
              </rect>
            </motion.g>

            {/* Mouth - smile */}
            <path d="M 50 40 Q 60 45 70 40" stroke="#00d4aa" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* Body */}
            <rect x="35" y="55" width="50" height="45" rx="10" fill="url(#bodyGradient)" stroke="#00d4aa" strokeWidth="2" />
            <defs>
              <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>

            {/* Chest Panel */}
            <rect x="50" y="65" width="20" height="25" rx="3" fill="#0f172a" stroke="#00d4aa" strokeWidth="1" />
            <circle cx="60" cy="77.5" r="6" fill="#00d4aa" opacity="0.5">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
            </circle>

            {/* Arms */}
            <motion.g
              animate={isWalking ? {
                rotate: [0, 20, -20, 0],
              } : {}}
              transition={{ duration: 0.6, repeat: Infinity }}
              style={{ transformOrigin: '35px 60px' }}
            >
              <rect x="25" y="60" width="10" height="30" rx="5" fill="#1e293b" stroke="#00d4aa" strokeWidth="2" />
              <circle cx="30" cy="92" r="5" fill="#00d4aa" />
            </motion.g>
            <motion.g
              animate={isWalking ? {
                rotate: [0, -20, 20, 0],
              } : {}}
              transition={{ duration: 0.6, repeat: Infinity }}
              style={{ transformOrigin: '85px 60px' }}
            >
              <rect x="85" y="60" width="10" height="30" rx="5" fill="#1e293b" stroke="#00d4aa" strokeWidth="2" />
              <circle cx="90" cy="92" r="5" fill="#00d4aa" />
            </motion.g>

            {/* Legs */}
            <motion.g
              animate={isWalking ? {
                rotate: [0, 15, -15, 0],
              } : {}}
              transition={{ duration: 0.6, repeat: Infinity }}
              style={{ transformOrigin: '48px 100px' }}
            >
              <rect x="43" y="100" width="10" height="25" rx="5" fill="#1e293b" stroke="#00d4aa" strokeWidth="2" />
              <ellipse cx="48" cy="127" rx="8" ry="4" fill="#00d4aa" />
            </motion.g>
            <motion.g
              animate={isWalking ? {
                rotate: [0, -15, 15, 0],
              } : {}}
              transition={{ duration: 0.6, repeat: Infinity }}
              style={{ transformOrigin: '72px 100px' }}
            >
              <rect x="67" y="100" width="10" height="25" rx="5" fill="#1e293b" stroke="#00d4aa" strokeWidth="2" />
              <ellipse cx="72" cy="127" rx="8" ry="4" fill="#00d4aa" />
            </motion.g>
          </svg>

          {/* Sparkles around character */}
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity },
            }}
          >
            <Sparkles size={20} className="text-cyan-400" />
          </motion.div>

          {/* Chat icon indicator */}
          <motion.div
            className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
          >
            <MessageCircle size={16} className="text-white" />
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}
