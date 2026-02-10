"use client"

import { useEffect, useState, useRef } from "react"
import { Github, Mail, ExternalLink, Star, MapPin, Phone, Calendar, GraduationCap, Briefcase, Code2, Server, Database, Cloud, ChevronDown, Building2, Activity, Terminal } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import { useSmoothScroll } from "@/hooks/useSmoothScroll"
import { AnimatedText, FadeIn, ScaleIn } from "@/components/AnimatedText"
import TiltCard from "@/components/TiltCard"
import GlowingBadge from "@/components/GlowingBadge"
import { useLanguage } from "@/contexts/LanguageContext"

// Dynamic imports for performance
const ParticleNetwork = dynamic(() => import("@/components/ParticleNetwork"), { ssr: false })
const CyberGrid = dynamic(() => import("@/components/CyberGrid"), { ssr: false })
const CursorGlow = dynamic(() => import("@/components/CursorGlow"), { ssr: false })
const LanguageSwitcher = dynamic(() => import("@/components/LanguageSwitcher"), { ssr: false })
const DevToolsBlocker = dynamic(() => import("@/components/DevToolsBlocker"), { ssr: false })
const AIChatBot = dynamic(() => import("@/components/AIChatBot"), { ssr: false })

interface GitHubProject {
  id: number
  name: string
  description: string | null
  url: string
  language: string | null
  stargazers_count: number
  topics: string[]
  owner: string
}

const FEATURED_REPOS = [
  { owner: "cms-lvtn-2025", repo: "be-lvtn" },
  { owner: "cms-lvtn-2025", repo: "be_queue" },
  { owner: "cms-lvtn-2025", repo: "plagiarism" },
  { owner: "cms-lvtn-2025", repo: "fe_new" },
  { owner: "cms-lvtn-2025", repo: "fe_admin" },
  { owner: "ThaiLyhcmut", repo: "DAPM-BE" },
  { owner: "ThaiLyhcmut", repo: "BE_product_update" },
]

const PROJECT_DETAILS: Record<string, { title: string; description: string; tech: string[] }> = {
  "cms-lvtn-2025/be-lvtn": {
    title: "Thesis Management - Core Services",
    description: "6 gRPC microservices (user, role, academic, thesis, council, file) with MySQL",
    tech: ["Golang", "gRPC", "MySQL", "Docker"],
  },
  "cms-lvtn-2025/be_queue": {
    title: "Thesis Management - Job Queue",
    description: "Async job processing with BullMQ for plagiarism check, file generation, grade calculation",
    tech: ["Node.js", "TypeScript", "BullMQ", "Redis"],
  },
  "cms-lvtn-2025/plagiarism": {
    title: "AI Plagiarism Detection",
    description: "OCR + Deep Learning, Elasticsearch full-text search, Vector Embeddings (bge-m3)",
    tech: ["Python", "Elasticsearch", "Ollama", "gRPC"],
  },
  "cms-lvtn-2025/fe_new": {
    title: "Thesis Management - Frontend",
    description: "Next.js frontend for Students, Lecturers, Academic Affairs Staff, Department Heads",
    tech: ["Next.js", "TypeScript", "TailwindCSS"],
  },
  "cms-lvtn-2025/fe_admin": {
    title: "Admin & Workflow Console",
    description: "Admin frontend for Super Admins to configure workflows and monitor BullMQ jobs",
    tech: ["Vite", "React", "TypeScript"],
  },
  "ThaiLyhcmut/DAPM-BE": {
    title: "Smart Home IoT System",
    description: "GraphQL API for smart home with real-time notifications, microservices, MQTT for IoT",
    tech: ["Golang", "GraphQL", "gRPC", "Kafka", "MQTT"],
  },
  "ThaiLyhcmut/BE_product_update": {
    title: "E-commerce Platform",
    description: "Online shopping with real-time chat (WebSocket), OTP auth, admin dashboard",
    tech: ["Express.js", "MongoDB", "Socket.io", "Cloudinary"],
  },
}

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
    title: t('experience.thesis.title'),
    company: t('experience.thesis.company'),
    location: t('experience.thesis.location'),
    period: t('experience.thesis.period'),
    description: [
      t('experience.thesis.desc1'),
      t('experience.thesis.desc2'),
      t('experience.thesis.desc3'),
    ],
    type: "project" as const,
  },
]

export default function Portfolio() {
  const [projects, setProjects] = useState<GitHubProject[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState("about")
  const { t } = useLanguage()

  useSmoothScroll()

  const aboutRef = useRef<HTMLElement>(null)
  const skillsRef = useRef<HTMLElement>(null)
  const experienceRef = useRef<HTMLElement>(null)
  const projectsRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: "about", ref: aboutRef },
        { id: "skills", ref: skillsRef },
        { id: "experience", ref: experienceRef },
        { id: "projects", ref: projectsRef },
      ]
      for (const section of sections) {
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect()
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const staticProjects: GitHubProject[] = FEATURED_REPOS.map(({ owner, repo }, index) => ({
      id: index + 1,
      name: repo,
      description: null,
      url: `https://github.com/${owner}/${repo}`,
      language: null,
      stargazers_count: 0,
      topics: [],
      owner: owner,
    }))
    setProjects(staticProjects)
    setLoading(false)
  }, [])

  const getProjectDetails = (owner: string, name: string) => {
    const details = PROJECT_DETAILS[`${owner}/${name}`]
    if (!details) return null

    // Use name directly as key (already matches translation keys)
    return {
      title: t(`project.${name}.title`),
      description: t(`project.${name}.desc`),
      tech: details.tech,
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-x-hidden">
      {/* Background Effects */}
      <ParticleNetwork />
      <CyberGrid />
      <CursorGlow />
      <LanguageSwitcher />
      <DevToolsBlocker />
      <AIChatBot />

      {/* Animated gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 right-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
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
                    href="https://github.com/ThaiLyhcmut"
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
                    href="https://github.com/orgs/cms-lvtn-2025"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-white hover:border-cyan-500/50 transition-all group"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Building2 size={20} className="group-hover:scale-110 transition" />
                    <span className="text-sm font-medium">{t('social.org')}</span>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ gridAutoRows: '1fr' }}>
                  {Object.entries(SKILLS).map(([category, skills], idx) => (
                    <ScaleIn key={category} delay={idx * 0.1} className="flex">
                      <TiltCard className="w-full">
                        <motion.div
                          className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 h-full flex flex-col min-h-[200px]"
                          whileHover={{ borderColor: "rgba(0, 212, 170, 0.3)" }}
                        >
                          <h3 className="text-sm font-semibold text-cyan-400 mb-4 uppercase tracking-wide flex items-center gap-2 flex-shrink-0">
                            <Code2 size={16} /> {category.charAt(0).toUpperCase() + category.slice(1)}
                          </h3>
                          <div className="flex flex-wrap gap-2 flex-grow content-start">
                            {skills.map((skill: any, skillIdx: number) => (
                              <motion.div
                                key={skill.name}
                                initial={{ opacity: 0, scale: 0 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: skillIdx * 0.05 }}
                                viewport={{ once: true }}
                              >
                                <GlowingBadge glowColor={skill.glow} className={`text-sm px-3 py-1.5 rounded-lg font-medium ${skill.color} cursor-default`}>
                                  {skill.name}
                                </GlowingBadge>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      </TiltCard>
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
                    <p className="text-slate-400 text-sm">{t('projects.subtitle')} ({projects.length})</p>
                  </div>
                </div>
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="flex items-center gap-3 text-slate-400">
                      <motion.div
                        className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      {t('projects.loading')}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {projects.map((project, idx) => {
                      const details = getProjectDetails(project.owner, project.name)
                      return (
                        <ScaleIn key={project.id} delay={idx * 0.05}>
                          <TiltCard>
                            <motion.div
                              className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden group relative"
                              whileHover={{ borderColor: "rgba(0, 212, 170, 0.5)" }}
                            >
                              {/* Animated glow effect */}
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100"
                                animate={{ x: ["-100%", "100%"] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              />

                              <div className="p-6 relative z-10">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition">{details?.title || project.name}</h3>
                                      {project.stargazers_count > 0 && (
                                        <div className="flex items-center gap-1 text-sm text-yellow-400">
                                          <Star size={14} fill="currentColor" /> {project.stargazers_count}
                                        </div>
                                      )}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                      {project.owner}/{project.name}
                                    </p>
                                  </div>
                                  <motion.a
                                    href={project.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Button variant="outline" size="sm" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 bg-transparent">
                                      <ExternalLink size={14} className="mr-1" /> {t('projects.view')}
                                    </Button>
                                  </motion.a>
                                </div>
                                <p className="text-slate-400 text-sm mb-4">{details?.description || project.description || t('projects.noDescription')}</p>
                                <div className="flex flex-wrap gap-2">
                                  {(details?.tech || [project.language]).filter(Boolean).map((tech, techIdx) => (
                                    <motion.span
                                      key={tech}
                                      className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded border border-cyan-500/30"
                                      initial={{ opacity: 0, scale: 0 }}
                                      whileInView={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: techIdx * 0.05 }}
                                      viewport={{ once: true }}
                                      whileHover={{ scale: 1.1, backgroundColor: "rgba(0, 212, 170, 0.3)" }}
                                    >
                                      {tech}
                                    </motion.span>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          </TiltCard>
                        </ScaleIn>
                      )
                    })}
                  </div>
                )}
              </FadeIn>
            </section>

            {/* GitHub Stats Section */}
            <section className="scroll-mt-8">
              <FadeIn delay={0.3}>
                <div className="flex items-center gap-4 mb-8">
                  <motion.div
                    className="p-3 rounded-xl bg-green-500/20 border border-green-500/30"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Activity size={24} className="text-green-400" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{t('activity.title')}</h2>
                    <p className="text-slate-400 text-sm">{t('activity.subtitle')}</p>
                  </div>
                </div>

                <motion.div
                  className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 overflow-hidden"
                  whileHover={{ borderColor: "rgba(0, 212, 170, 0.3)" }}
                >
                  <div className="flex justify-center">
                    <motion.img
                      src="https://ghchart.rshah.org/00d4aa/thailyhcmut"
                      alt="GitHub Contribution Graph"
                      className="w-full max-w-2xl rounded-lg"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </motion.div>
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
