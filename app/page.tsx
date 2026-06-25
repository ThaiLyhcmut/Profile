"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { Github, Mail, ExternalLink, Star, MapPin, Phone, Calendar, GraduationCap, Briefcase, Code2, Server, Database, Cloud, ChevronDown, Building2, Activity, Terminal, ArrowRight, Lock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import { useSmoothScroll } from "@/hooks/useSmoothScroll"
import { AnimatedText, FadeIn, ScaleIn } from "@/components/AnimatedText"
import TiltCard from "@/components/TiltCard"
import GlowingBadge from "@/components/GlowingBadge"
import { useLanguage } from "@/contexts/LanguageContext"
import { PROJECTS, tr } from "@/lib/projects"

// Dynamic imports for performance
const MatrixRain = dynamic(() => import("@/components/MatrixRain"), { ssr: false })
const CyberGrid = dynamic(() => import("@/components/CyberGrid"), { ssr: false })
const LanguageSwitcher = dynamic(() => import("@/components/LanguageSwitcher"), { ssr: false })
const AIChatBot = dynamic(() => import("@/components/AIChatBot"), { ssr: false })

const SKILLS = {
  languages: [
    { name: "Golang", color: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30", glow: "cyan" },
    { name: "JavaScript", color: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30", glow: "orange" },
    { name: "TypeScript", color: "bg-blue-500/20 text-blue-400 border border-blue-500/30", glow: "blue" },
    { name: "Python", color: "bg-green-500/20 text-green-400 border border-green-500/30", glow: "green" },
    { name: "Solidity", color: "bg-purple-500/20 text-purple-400 border border-purple-500/30", glow: "purple" },
  ],
  backend: [
    { name: "Gin", color: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30", glow: "cyan" },
    { name: "Express.js", color: "bg-gray-500/20 text-gray-300 border border-gray-500/30", glow: "cyan" },
    { name: "FastAPI", color: "bg-teal-500/20 text-teal-400 border border-teal-500/30", glow: "cyan" },
    { name: "Node.js", color: "bg-green-600/20 text-green-400 border border-green-600/30", glow: "green" },
  ],
  api: [
    { name: "gRPC", color: "bg-blue-500/20 text-blue-400 border border-blue-500/30", glow: "blue" },
    { name: "GraphQL", color: "bg-pink-500/20 text-pink-400 border border-pink-500/30", glow: "pink" },
    { name: "REST API", color: "bg-orange-500/20 text-orange-400 border border-orange-500/30", glow: "orange" },
    { name: "WebSocket", color: "bg-purple-500/20 text-purple-400 border border-purple-500/30", glow: "purple" },
    { name: "MQTT", color: "bg-violet-500/20 text-violet-400 border border-violet-500/30", glow: "purple" },
  ],
  messageQueue: [
    { name: "Apache Kafka", color: "bg-orange-600/20 text-orange-400 border border-orange-600/30", glow: "orange" },
    { name: "BullMQ", color: "bg-red-500/20 text-red-400 border border-red-500/30", glow: "orange" },
    { name: "Redis Pub/Sub", color: "bg-red-600/20 text-red-400 border border-red-600/30", glow: "orange" },
  ],
  databases: [
    { name: "PostgreSQL", color: "bg-blue-700/20 text-blue-300 border border-blue-700/30", glow: "blue" },
    { name: "MySQL", color: "bg-blue-600/20 text-blue-400 border border-blue-600/30", glow: "blue" },
    { name: "MongoDB", color: "bg-green-700/20 text-green-300 border border-green-700/30", glow: "green" },
    { name: "Redis", color: "bg-red-600/20 text-red-400 border border-red-600/30", glow: "orange" },
    { name: "Elasticsearch", color: "bg-yellow-600/20 text-yellow-400 border border-yellow-600/30", glow: "orange" },
  ],
  devops: [
    { name: "Docker", color: "bg-blue-500/20 text-blue-400 border border-blue-500/30", glow: "blue" },
    { name: "Nginx", color: "bg-green-600/20 text-green-400 border border-green-600/30", glow: "green" },
    { name: "MinIO", color: "bg-red-500/20 text-red-400 border border-red-500/30", glow: "orange" },
    { name: "Portainer", color: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30", glow: "cyan" },
  ],
  cloud: [
    { name: "AWS", color: "bg-orange-500/20 text-orange-400 border border-orange-500/30", glow: "orange" },
    { name: "Azure", color: "bg-blue-600/20 text-blue-400 border border-blue-600/30", glow: "blue" },
    { name: "Google Cloud", color: "bg-red-500/20 text-red-400 border border-red-500/30", glow: "orange" },
  ],
  monitoring: [
    { name: "Grafana", color: "bg-orange-500/20 text-orange-400 border border-orange-500/30", glow: "orange" },
    { name: "Prometheus", color: "bg-orange-600/20 text-orange-400 border border-orange-600/30", glow: "orange" },
    { name: "Loki", color: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30", glow: "orange" },
    { name: "Kibana", color: "bg-pink-500/20 text-pink-400 border border-pink-500/30", glow: "pink" },
  ],
}

// Experience data will be pulled from translations
const getExperienceData = (t: (key: string) => string) => [
  {
    title: t('experience.mangoads.title'),
    company: t('experience.mangoads.company'),
    location: "Ho Chi Minh City",
    period: t('experience.mangoads.period'),
    description: [
      t('experience.mangoads.desc1'),
      t('experience.mangoads.desc2'),
      t('experience.mangoads.desc3'),
      t('experience.mangoads.desc4'),
    ],
    type: "work" as const,
  },
  {
    title: t('experience.covergo.title'),
    company: t('experience.covergo.company'),
    location: t('experience.covergo.location'),
    period: t('experience.covergo.period'),
    description: [
      t('experience.covergo.desc1'),
      t('experience.covergo.desc2'),
    ],
    type: "project" as const,
  },
]

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("about")
  const { t, language } = useLanguage()

  useSmoothScroll()

  const aboutRef = useRef<HTMLElement>(null)
  const skillsRef = useRef<HTMLElement>(null)
  const experienceRef = useRef<HTMLElement>(null)
  const projectsRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const refs = [aboutRef, skillsRef, experienceRef, projectsRef]
    // IntersectionObserver: không gọi getBoundingClientRect mỗi frame -> hết reflow khi cuộn
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.target.id) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { rootMargin: "-150px 0px -55% 0px", threshold: 0 }
    )
    refs.forEach((ref) => ref.current && observer.observe(ref.current))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-x-hidden">
      {/* Background Effects */}
      <MatrixRain />
      <CyberGrid />
      <LanguageSwitcher />
      <AIChatBot />

      {/* Animated gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-2xl will-change-transform"
          animate={{ x: [0, 30, 0], y: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-2xl will-change-transform"
          animate={{ x: [0, -25, 0], y: [0, -20, 0], opacity: [0.45, 0.3, 0.45] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 right-1/3 w-96 h-96 bg-emerald-500/20 rounded-full blur-2xl will-change-transform"
          animate={{ x: [0, 20, 0], y: [0, -30, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-12">
              <FadeIn delay={0.2}>
                {/* Profile Card */}
                <motion.div
                  className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 mb-6 relative overflow-hidden"
                  whileHover={{ borderColor: "rgba(0, 212, 170, 0.5)" }}
                >
                  {/* Animated border glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 opacity-0 hover:opacity-100 transition-opacity duration-500" />

                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <motion.img
                      src="/avatar.jpg"
                      alt="Ly Vinh Thai"
                      className="w-20 h-20 rounded-2xl object-cover shadow-lg shadow-cyan-500/50 border-2 border-cyan-500/30"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                    <div>
                      <h1 className="text-2xl font-bold text-white">Ly Vinh Thai</h1>
                      <p className="text-cyan-400 font-medium flex items-center gap-2">
                        <Terminal size={16} className="animate-pulse" />
                        {t('header.role')}
                      </p>
                      <motion.span
                        className="inline-block mt-1 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {t('header.openToWork')}
                      </motion.span>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm relative z-10">
                    <motion.a
                      href="tel:0366063879"
                      className="flex items-center gap-3 text-slate-400 hover:text-cyan-400 transition group"
                      whileHover={{ x: 5 }}
                    >
                      <Phone size={16} className="text-cyan-400 group-hover:scale-110 transition" />
                      <span>0366 063 879</span>
                    </motion.a>
                    <motion.a
                      href="mailto:lyvinhthai321@gmail.com"
                      className="flex items-center gap-3 text-slate-400 hover:text-cyan-400 transition group"
                      whileHover={{ x: 5 }}
                    >
                      <Mail size={16} className="text-cyan-400 group-hover:scale-110 transition" />
                      <span>lyvinhthai321@gmail.com</span>
                    </motion.a>
                    <div className="flex items-center gap-3 text-slate-400">
                      <MapPin size={16} className="text-cyan-400" />
                      <span>Thu Duc City, Ho Chi Minh</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                      <Calendar size={16} className="text-cyan-400" />
                      <span>08/04/2004</span>
                    </div>
                  </div>
                </motion.div>

                {/* Navigation */}
                <motion.nav
                  className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <ul className="space-y-1">
                    {[
                      { id: "about", label: t('nav.about'), icon: Code2 },
                      { id: "skills", label: t('nav.skills'), icon: Server },
                      { id: "experience", label: t('nav.experience'), icon: Briefcase },
                      { id: "projects", label: t('nav.projects'), icon: Github },
                    ].map((item) => (
                      <motion.li key={item.id} whileHover={{ x: 5 }}>
                        <a
                          href={`#${item.id}`}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                            activeSection === item.id
                              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/20"
                              : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                          }`}
                        >
                          <item.icon size={18} />
                          <span className="font-medium">{item.label}</span>
                          {activeSection === item.id && (
                            <motion.div
                              layoutId="activeIndicator"
                              className="ml-auto"
                            >
                              <ChevronDown size={16} className="rotate-[-90deg]" />
                            </motion.div>
                          )}
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </motion.nav>

                {/* Social Links */}
                <motion.div
                  className="flex gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.a
                    href="https://github.com/thailymmo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-white hover:border-cyan-500/50 transition-all group"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Github size={20} className="group-hover:scale-110 transition" />
                    <span className="text-sm font-medium">{t('social.github')}</span>
                  </motion.a>
                  <motion.a
                    href="mailto:lyvinhthai321@gmail.com"
                    className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:opacity-90 transition-all group relative overflow-hidden"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                    <Mail size={20} className="group-hover:scale-110 transition relative z-10" />
                    <span className="text-sm font-medium relative z-10">{t('social.hire')}</span>
                  </motion.a>
                </motion.div>

                {/* Featured projects - lấp khoảng trống sidebar trái (chỉ desktop) */}
                <motion.div
                  className="hidden lg:block mt-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wide flex items-center gap-2 mb-3 px-1">
                    <Github size={14} /> {t('projects.title')}
                  </h3>
                  <div className="space-y-1.5">
                    {PROJECTS.map((project) => (
                      <Link
                        key={project.slug}
                        href={`/projects/${project.slug}`}
                        className="block group rounded-xl px-3 py-2.5 border border-transparent hover:border-cyan-500/30 hover:bg-slate-700/30 transition-all"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-slate-200 group-hover:text-cyan-400 transition truncate">{project.title}</span>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {project.team && (
                              <span className="text-[9px] text-cyan-400/80 bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-px rounded-full whitespace-nowrap">
                                {tr(project.team, language)}
                              </span>
                            )}
                            {project.private && <Lock size={11} className="text-slate-500" />}
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-1">{tr(project.tagline, language)}</p>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              </FadeIn>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-16">
            {/* About Section */}
            <section ref={aboutRef} id="about" className="scroll-mt-8">
              <FadeIn delay={0.5}>
                <div className="flex items-center gap-4 mb-8">
                  <motion.div
                    className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/30"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Code2 size={24} className="text-cyan-400" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{t('about.title')}</h2>
                    <p className="text-slate-400 text-sm">{t('about.subtitle')}</p>
                  </div>
                </div>
                <motion.div
                  className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 relative overflow-hidden"
                  whileHover={{ borderColor: "rgba(0, 212, 170, 0.3)" }}
                >
                  {/* Animated corner decorations */}
                  <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-cyan-500/30" />
                  <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-cyan-500/30" />

                  <div className="space-y-4 text-slate-300 leading-relaxed relative z-10">
                    <p dangerouslySetInnerHTML={{ __html: t('about.intro1') }} />
                    <p dangerouslySetInnerHTML={{ __html: t('about.intro2') }} />
                    <p>{t('about.intro3')}</p>
                  </div>

                  {/* Education */}
                  <div className="mt-8 pt-8 border-t border-slate-700/50 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <GraduationCap size={20} className="text-cyan-400" />
                      <h3 className="text-lg font-semibold text-white">{t('about.education')}</h3>
                    </div>
                    <motion.div
                      className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/30"
                      whileHover={{ scale: 1.02, borderColor: "rgba(0, 212, 170, 0.3)" }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-white">{t('about.university')}</h4>
                          <p className="text-cyan-400 text-sm">{t('about.major')}</p>
                          <p className="text-slate-400 text-sm mt-1">{t('about.year')}</p>
                        </div>
                        <span className="text-sm text-slate-400 bg-slate-800 px-3 py-1 rounded-full">{t('about.period')}</span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </FadeIn>
            </section>

            {/* Skills Section */}
            <section ref={skillsRef} id="skills" className="scroll-mt-8">
              <FadeIn delay={0.3}>
                <div className="flex items-center gap-4 mb-8">
                  <motion.div
                    className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/30"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Server size={24} className="text-blue-400" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{t('skills.title')}</h2>
                    <p className="text-slate-400 text-sm">{t('skills.subtitle')}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ gridAutoRows: '1fr' }}>
                  {Object.entries(SKILLS).map(([category, skills], idx) => (
                    <ScaleIn key={category} delay={idx * 0.06} className="flex">
                      <motion.div
                        className="w-full bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 flex flex-col"
                        whileHover={{ borderColor: "rgba(0, 212, 170, 0.3)" }}
                      >
                        <h3 className="text-xs font-semibold text-cyan-400 mb-2.5 uppercase tracking-wide flex items-center gap-1.5 flex-shrink-0">
                          <Code2 size={14} /> {category.charAt(0).toUpperCase() + category.slice(1)}
                        </h3>
                        <div className="flex flex-wrap gap-1.5 content-start">
                          {skills.map((skill: any) => (
                            <span
                              key={skill.name}
                              className={`text-xs px-2 py-0.5 rounded-md font-medium ${skill.color} cursor-default`}
                            >
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    </ScaleIn>
                  ))}
                </div>
              </FadeIn>
            </section>

            {/* Experience Section */}
            <section ref={experienceRef} id="experience" className="scroll-mt-8">
              <FadeIn delay={0.3}>
                <div className="flex items-center gap-4 mb-8">
                  <motion.div
                    className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/30"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Briefcase size={24} className="text-purple-400" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{t('experience.title')}</h2>
                    <p className="text-slate-400 text-sm">{t('experience.subtitle')}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  {getExperienceData(t).map((exp, index) => (
                    <ScaleIn key={index} delay={index * 0.1}>
                      <TiltCard>
                        <motion.div
                          className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 group relative overflow-hidden"
                          whileHover={{ borderColor: "rgba(0, 212, 170, 0.3)" }}
                        >
                          {/* Animated background gradient on hover */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />

                          <div className="flex items-start justify-between mb-4 relative z-10">
                            <div className="flex items-start gap-4">
                              <motion.div
                                className={`p-3 rounded-xl ${exp.type === "work" ? "bg-green-500/20 border border-green-500/30" : "bg-blue-500/20 border border-blue-500/30"}`}
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                              >
                                {exp.type === "work" ? <Briefcase size={20} className="text-green-400" /> : <Code2 size={20} className="text-blue-400" />}
                              </motion.div>
                              <div>
                                <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition">{exp.title}</h3>
                                <p className={`font-medium ${exp.type === "work" ? "text-green-400" : "text-blue-400"}`}>{exp.company}</p>
                                <p className="text-slate-400 text-sm flex items-center gap-2 mt-1">
                                  <MapPin size={14} /> {exp.location}
                                </p>
                              </div>
                            </div>
                            <span className="text-sm text-slate-400 bg-slate-800 px-3 py-1 rounded-full whitespace-nowrap">{exp.period}</span>
                          </div>
                          <ul className="space-y-2 ml-16 relative z-10">
                            {exp.description.map((item, i) => (
                              <motion.li
                                key={i}
                                className="text-slate-300 text-sm flex items-start gap-2"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                              >
                                <span className="text-cyan-400 mt-1.5">▸</span> {item}
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      </TiltCard>
                    </ScaleIn>
                  ))}
                </div>
              </FadeIn>
            </section>

            {/* Projects Section */}
            <section ref={projectsRef} id="projects" className="scroll-mt-8">
              <FadeIn delay={0.3}>
                <div className="flex items-center gap-4 mb-8">
                  <motion.div
                    className="p-3 rounded-xl bg-orange-500/20 border border-orange-500/30"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Github size={24} className="text-orange-400" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{t('projects.title')}</h2>
                    <p className="text-slate-400 text-sm">{t('projects.subtitle')} ({PROJECTS.length})</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PROJECTS.map((project, idx) => (
                    <ScaleIn key={project.slug} delay={idx * 0.05}>
                      <Link href={`/projects/${project.slug}`} className="block h-full">
                        <motion.div
                          className="h-full bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 group relative overflow-hidden flex flex-col"
                          whileHover={{ borderColor: "rgba(0, 212, 170, 0.5)", y: -3 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="text-base font-semibold text-white group-hover:text-cyan-400 transition">{project.title}</h3>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              {project.team && (
                                <span className="text-[10px] text-cyan-400/90 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full whitespace-nowrap">
                                  {tr(project.team, language)}
                                </span>
                              )}
                              {project.private && (
                                <span className="text-[10px] text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Lock size={10} /> Private
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-slate-400 text-sm mb-4 flex-grow">{tr(project.tagline, language)}</p>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex flex-wrap gap-1.5">
                              {project.tech.slice(0, 3).map((tech) => (
                                <span key={tech} className="text-[11px] bg-cyan-500/15 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/25">
                                  {tech}
                                </span>
                              ))}
                              {project.tech.length > 3 && (
                                <span className="text-[11px] text-slate-500 px-1 py-0.5">+{project.tech.length - 3}</span>
                              )}
                            </div>
                            <span className="flex-shrink-0 text-cyan-400 flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition">
                              {t('projects.view')} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                          </div>
                        </motion.div>
                      </Link>
                    </ScaleIn>
                  ))}
                </div>
              </FadeIn>
            </section>

            {/* Footer */}
            <motion.footer
              className="text-center py-8 border-t border-slate-800"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <p className="text-slate-500 text-sm">
                {t('footer.builtWith')} | Ly Vinh Thai &copy; {new Date().getFullYear()}
              </p>
            </motion.footer>
          </div>
        </div>
      </div>
    </div>
  )
}
