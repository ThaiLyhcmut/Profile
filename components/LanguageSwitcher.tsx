"use client"

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <motion.div
      className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-full p-1"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Globe size={16} className="text-cyan-400 ml-2" />
      <motion.button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
          language === 'en'
            ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
            : 'text-slate-400 hover:text-white'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        EN
      </motion.button>
      <motion.button
        onClick={() => setLanguage('vi')}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
          language === 'vi'
            ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
            : 'text-slate-400 hover:text-white'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        VI
      </motion.button>
    </motion.div>
  )
}
