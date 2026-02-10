"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, X, Send, Sparkles, Zap, Brain } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm Thai's AI assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { language } = useLanguage()

  // Show bot immediately on mount
  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Auto scroll to bottom when new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessageText = inputValue

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: userMessageText,
      sender: 'user',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')

    // Add "typing" indicator
    const typingMessage: Message = {
      id: messages.length + 2,
      text: '...',
      sender: 'bot',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, typingMessage])

    try {
      // Call API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessageText,
          chatHistory: messages.filter(m => m.text !== '...').map(m => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()

      // Replace typing indicator with actual response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === typingMessage.id
            ? { ...msg, text: data.message }
            : msg
        )
      )
    } catch (error) {
      console.error('Error calling AI:', error)

      // Replace typing indicator with error message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === typingMessage.id
            ? {
                ...msg,
                text: language === 'vi'
                  ? 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.'
                  : 'Sorry, an error occurred. Please try again later.'
              }
            : msg
        )
      )
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Floating Bot Button */}
      <AnimatePresence>
        {isVisible && !isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 left-8 z-50 group"
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Button */}
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/50 border-2 border-cyan-400/30">
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <Bot size={32} className="text-white" />
              </motion.div>

              {/* Pulse rings */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-cyan-400"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-blue-400"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 1,
                }}
              />

              {/* Notification badge */}
              <motion.div
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-slate-950"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
              >
                AI
              </motion.div>
            </div>

            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="absolute left-20 top-1/2 -translate-y-1/2 whitespace-nowrap bg-slate-800 text-white px-3 py-2 rounded-lg text-sm font-medium border border-cyan-500/30 shadow-lg"
            >
              {language === 'vi' ? 'Trợ lý AI của Thai' : "Thai's AI Assistant"}
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-8 left-8 z-50 w-96 h-[600px] bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-cyan-500/30 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-b border-cyan-500/30 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Brain size={20} className="text-white" />
                  </div>
                  <motion.div
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-white flex items-center gap-2">
                    AI Assistant
                    <Sparkles size={14} className="text-cyan-400" />
                  </h3>
                  <p className="text-xs text-slate-400">
                    {language === 'vi' ? 'Đang trực tuyến' : 'Online'}
                  </p>
                </div>
              </div>
              <motion.button
                onClick={() => setIsOpen(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 hover:bg-slate-800 rounded-lg transition"
              >
                <X size={20} className="text-slate-400" />
              </motion.button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                        : 'bg-slate-800 text-slate-200 border border-cyan-500/20'
                    }`}
                  >
                    {message.sender === 'bot' && (
                      <div className="flex items-center gap-2 mb-1">
                        <Bot size={14} className="text-cyan-400" />
                        <span className="text-xs text-cyan-400 font-semibold">Thai's AI</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className="text-xs opacity-50 mt-1">
                      {message.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-cyan-500/30 bg-slate-800/50">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={language === 'vi' ? 'Nhập tin nhắn...' : 'Type a message...'}
                  className="flex-1 bg-slate-900 text-white px-4 py-3 rounded-xl border border-cyan-500/30 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition"
                />
                <motion.button
                  onClick={handleSendMessage}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!inputValue.trim()}
                >
                  <Send size={20} />
                </motion.button>
              </div>
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <Zap size={12} />
                {language === 'vi'
                  ? 'Powered by AI - Đang phát triển'
                  : 'Powered by AI - Under Development'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
