"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, X, Send, Sparkles, Zap, Brain, Download, FileText } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import dynamic from 'next/dynamic'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'

const AICharacter = dynamic(() => import('./AICharacter'), { ssr: false })

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

  // Handle CV download directly without redirect
  const handleDownloadCV = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      console.log('Starting CV download...')
      const response = await fetch('/api/cv')

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const blob = await response.blob()
      console.log('Blob created:', blob.size, 'bytes')

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'CV_LyVinhThai.pdf'
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()

      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }, 100)

      console.log('Download triggered successfully')
    } catch (error) {
      console.error('Download error:', error)
      alert(language === 'vi'
        ? 'Không thể tải CV. Vui lòng thử lại sau.'
        : 'Cannot download CV. Please try again later.')
    }
  }

  // Custom markdown components for better rendering
  const markdownComponents: Components = {
    a: ({ href, children, ...props }) => {
      // Check if this is a CV download link
      if (href === '/api/cv') {
        return (
          <motion.span
            onClick={handleDownloadCV}
            className="inline-flex items-center gap-3 p-4 my-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl hover:border-cyan-500 transition group cursor-pointer w-full"
            style={{ display: 'inline-flex' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 inline-flex items-center justify-center flex-shrink-0">
              <FileText size={24} className="text-white" />
            </span>
            <span className="flex-1 inline-flex flex-col">
              <span className="font-semibold text-white text-sm">CV_LyVinhThai.pdf</span>
              <span className="text-xs text-slate-400">
                {language === 'vi' ? 'Nhấn để tải xuống' : 'Click to download'}
              </span>
            </span>
            <Download size={20} className="text-cyan-400 group-hover:text-cyan-300 transition" />
          </motion.span>
        )
      }
      // Regular links
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 underline"
          {...props}
        >
          {children}
        </a>
      )
    },
  }

  return (
    <>
      {/* AI Character walking around - Click to open chat */}
      {isVisible && <AICharacter onOpenChat={() => setIsOpen(true)} />}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed inset-4 sm:inset-auto sm:bottom-8 sm:left-8 z-50 sm:w-96 h-[calc(100vh-2rem)] sm:h-[600px] bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-cyan-500/30 overflow-hidden flex flex-col"
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
            <div
              data-lenis-prevent
              className="flex-1 overflow-y-auto p-4 space-y-4"
              style={{
                overscrollBehavior: 'contain',
                WebkitOverflowScrolling: 'touch'
              }}
            >
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
                    {message.sender === 'bot' ? (
                      <div className="text-sm leading-relaxed prose prose-sm prose-invert max-w-none">
                        <ReactMarkdown components={markdownComponents}>
                          {message.text}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    )}
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
