"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import {
  ArrowLeft, ExternalLink, Lock, CheckCircle2, Sparkles, Calendar, ChevronDown,
  Bot, GitBranch, MessageSquare, Mail, CreditCard, Activity, Layers, Boxes,
  Users, Server, Zap, Terminal, Database, HardDrive, Cloud, LayoutDashboard,
  Send, Video, ScrollText, BarChart3, User, Radio, Cpu, Wallet, Building2,
  Puzzle, ShieldCheck, FileSpreadsheet, Image, Bell, GraduationCap,
} from "lucide-react"
import { getProject, tr } from "@/lib/projects"
import { FadeIn } from "@/components/AnimatedText"
import { useLanguage } from "@/contexts/LanguageContext"

const CyberGrid = dynamic(() => import("@/components/CyberGrid"), { ssr: false })
const LanguageSwitcher = dynamic(() => import("@/components/LanguageSwitcher"), { ssr: false })

const UI = {
  vi: { back: "Quay lại trang chính", notFound: "Không tìm thấy project", overview: "Tổng quan", role: "Vai trò: ", arch: "Kiến trúc hệ thống", modules: "Modules & Services", features: "Tính năng chính", highlights: "Điểm nổi bật" },
  en: { back: "Back to home", notFound: "Project not found", overview: "Overview", role: "Role: ", arch: "System architecture", modules: "Modules & Services", features: "Key features", highlights: "Highlights" },
}

const ICONS: Record<string, any> = {
  Bot, GitBranch, MessageSquare, Mail, CreditCard, Activity, Layers, Boxes,
  Users, Server, Zap, Terminal, Database, HardDrive, Cloud, LayoutDashboard,
  Send, Video, ScrollText, BarChart3, User, Radio, Cpu, Wallet, Building2,
  Puzzle, ShieldCheck, FileSpreadsheet, Image, Bell, Lock, GraduationCap,
}

// Map label node trong sơ đồ -> icon
const NODE_ICONS: Record<string, any> = {
  Dashboard: LayoutDashboard, Telegram: Send, FastAPI: Cpu, WebSocket: Radio,
  MongoDB: Database, Redis: Database, MySQL: Database, "AWS S3": HardDrive, MinIO: HardDrive,
  "Cloudflare Worker": Cloud, "Bot Agent": Bot, "Userbot Agent": User, "Video Service": Video,
  Loki: ScrollText, Grafana: BarChart3, Reports: BarChart3,
  "Web / Mobile": LayoutDashboard, gqlgen: GitBranch, DataLoaders: Database, "@auth": Lock,
  "Admin REST": Server, business_rule: CheckCircle2, read_scope: Lock, action: Zap,
  "CRUD Handlers": Database, "Filter whitelist": GitBranch, "Tracer + logger": ScrollText,
  "REST endpoints": Send, "Auth & Permissions": Lock, "Plugin hooks": Puzzle,
  "Query builder": GitBranch, "Permission resolver": Lock, Collections: Database,
  "Schema (native)": Database, Fastify: Zap, Prometheus: Activity, BullMQ: Layers,
  "Image pipeline": Image, Sharp: Image, AJV: ShieldCheck, Swagger: ScrollText,
  Pino: ScrollText, "JWT / Passport": Lock,
  "Topic / News": ScrollText, "Desktop App": LayoutDashboard, "Claude Agent SDK": Bot,
  "9router": Radio, "Web research": Cloud, "edge-TTS": MessageSquare, Remotion: Video,
  Playwright: Cpu, "Captcha solver": ShieldCheck, Scheduler: Bell, n8n: GitBranch, FastAPI: Cpu,
  "Business Engine": Boxes, "JWT + OAuth": Lock, user: User, academic: GraduationCap,
  thesis: ScrollText, council: Users, file: HardDrive,
}

// Lưu class literal đầy đủ (kể cả hover:) để Tailwind JIT nhận diện được khi quét file.
const ACCENT: Record<string, { text: string; border: string; bg: string; glow: string; hoverGlow: string; hoverBorder: string; grad: string; rgb: string }> = {
  cyan: { text: "text-cyan-400", border: "border-cyan-500/30", bg: "bg-cyan-500/10", glow: "shadow-[0_0_25px_-5px_rgba(34,211,238,0.5)]", hoverGlow: "hover:shadow-[0_0_25px_-5px_rgba(34,211,238,0.5)]", hoverBorder: "hover:border-cyan-500/50", grad: "from-cyan-400 to-blue-500", rgb: "34,211,238" },
  emerald: { text: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10", glow: "shadow-[0_0_25px_-5px_rgba(16,185,129,0.5)]", hoverGlow: "hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.5)]", hoverBorder: "hover:border-emerald-500/50", grad: "from-emerald-400 to-cyan-500", rgb: "16,185,129" },
  purple: { text: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/10", glow: "shadow-[0_0_25px_-5px_rgba(168,85,247,0.5)]", hoverGlow: "hover:shadow-[0_0_25px_-5px_rgba(168,85,247,0.5)]", hoverBorder: "hover:border-purple-500/50", grad: "from-purple-400 to-pink-500", rgb: "168,85,247" },
  orange: { text: "text-orange-400", border: "border-orange-500/30", bg: "bg-orange-500/10", glow: "shadow-[0_0_25px_-5px_rgba(249,115,22,0.5)]", hoverGlow: "hover:shadow-[0_0_25px_-5px_rgba(249,115,22,0.5)]", hoverBorder: "hover:border-orange-500/50", grad: "from-orange-400 to-amber-500", rgb: "249,115,22" },
  blue: { text: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10", glow: "shadow-[0_0_25px_-5px_rgba(59,130,246,0.5)]", hoverGlow: "hover:shadow-[0_0_25px_-5px_rgba(59,130,246,0.5)]", hoverBorder: "hover:border-blue-500/50", grad: "from-blue-400 to-indigo-500", rgb: "59,130,246" },
  pink: { text: "text-pink-400", border: "border-pink-500/30", bg: "bg-pink-500/10", glow: "shadow-[0_0_25px_-5px_rgba(236,72,153,0.5)]", hoverGlow: "hover:shadow-[0_0_25px_-5px_rgba(236,72,153,0.5)]", hoverBorder: "hover:border-pink-500/50", grad: "from-pink-400 to-rose-500", rgb: "236,72,153" },
}

// Số nhảy count-up: tách tiền tố/số/hậu tố ("100K+" -> "" "100" "K+")
function CountUp({ value, className }: { value: string; className?: string }) {
  const m = value.match(/^(\D*)(\d[\d,.]*)(.*)$/)
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(m ? "0" : value)

  useEffect(() => {
    if (!m) return
    const el = ref.current
    if (!el) return
    const target = parseInt(m[2].replace(/[,.]/g, ""), 10)
    let raf = 0
    let started = false
    const run = (start: number) => (now: number) => {
      const p = Math.min(1, (now - start) / 900)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(target * eased).toLocaleString())
      if (p < 1) raf = requestAnimationFrame(run(start))
    }
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started) {
        started = true
        raf = requestAnimationFrame((t) => run(t)(t))
      }
    })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [value])

  if (!m) return <span className={className}>{value}</span>
  return (
    <span ref={ref} className={className}>
      {m[1]}{display}{m[3]}
    </span>
  )
}

export default function ProjectDetail() {
  const params = useParams<{ slug: string }>()
  const { language } = useLanguage()
  const lang = language === "en" ? "en" : "vi"
  const u = UI[lang]
  const project = getProject(params.slug)

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center gap-4 text-center px-4">
        <h1 className="text-2xl font-bold text-white">{u.notFound}</h1>
        <Link href="/#projects" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2">
          <ArrowLeft size={18} /> {u.back}
        </Link>
      </div>
    )
  }

  const a = ACCENT[project.accent || "cyan"] ?? ACCENT.cyan
  const Glyph = ICONS[project.icon || "Terminal"] || Terminal

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-x-hidden">
      <CyberGrid />
      <LanguageSwitcher />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 z-10">
        {/* Back */}
        <Link href="/#projects" className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition mb-8 group font-mono text-sm">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>{u.back}</span>
        </Link>

        <FadeIn>
          {/* Hero */}
          <div className={`rounded-2xl p-8 border ${a.border} bg-slate-800/40 backdrop-blur-sm relative overflow-hidden ${a.glow}`}>
            <div className={`absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 ${a.border}`} />
            <div className={`absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 ${a.border}`} />

            <div className="flex items-start gap-5 relative z-10">
              {/* Glowing glyph */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 14 }}
                className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${a.grad} flex items-center justify-center ${a.glow}`}
              >
                <Glyph size={32} className="text-white" />
              </motion.div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-mono ${a.text} ${a.bg} px-2 py-0.5 rounded border ${a.border}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> ONLINE
                  </span>
                  {project.year && (
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded flex items-center gap-1.5">
                      <Calendar size={11} /> {project.year}
                    </span>
                  )}
                  {project.private && (
                    <span className="text-[11px] font-mono text-slate-300 bg-slate-900/60 px-2 py-0.5 rounded flex items-center gap-1.5">
                      <Lock size={11} /> PRIVATE
                    </span>
                  )}
                  {project.team && (
                    <span className="text-[11px] font-mono text-slate-300 bg-slate-900/60 px-2 py-0.5 rounded flex items-center gap-1.5">
                      <Users size={11} /> {tr(project.team, lang)}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{project.title}</h1>
                <p className={`${a.text} mt-1`}>{tr(project.tagline, lang)}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6 relative z-10">
              {project.tech.map((t) => (
                <span key={t} className={`text-xs font-mono ${a.bg} ${a.text} px-2.5 py-1 rounded border ${a.border}`}>
                  {t}
                </span>
              ))}
            </div>

            {project.links && project.links.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-6 relative z-10">
                {project.links.map((l) => (
                  <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg border ${a.border} ${a.text} hover:bg-slate-800 transition`}>
                    <ExternalLink size={14} /> {tr(l.label, lang)}
                  </a>
                ))}
              </div>
            )}
          </div>
        </FadeIn>

        {/* Stats */}
        {project.stats && project.stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {project.stats.map((s, i) => {
              const Icon = ICONS[s.icon || "Activity"] || Activity
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, type: "spring", stiffness: 200, damping: 18 }}
                  whileHover={{ y: -4 }}
                  className={`rounded-2xl p-5 border ${a.border} bg-slate-800/40 backdrop-blur-sm relative overflow-hidden group ${a.hoverGlow} transition-shadow`}
                >
                  <Icon size={18} className={`${a.text} mb-2`} />
                  <CountUp value={s.value} className={`block text-3xl font-bold font-mono bg-gradient-to-r ${a.grad} bg-clip-text text-transparent`} />
                  <div className="text-xs text-slate-400 mt-1">{tr(s.label, lang)}</div>
                  <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
                    <Icon size={70} className={a.text} />
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Overview */}
        <FadeIn delay={0.1}>
          <section className="mt-8 rounded-2xl p-8 border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Boxes size={18} className={a.text} /> {u.overview}
            </h2>
            <p className="text-slate-300 leading-relaxed">{tr(project.overview, lang)}</p>
            {project.role && (
              <p className="text-slate-400 text-sm mt-4">
                <span className="text-slate-500">{u.role}</span>{tr(project.role, lang)}
              </p>
            )}
          </section>
        </FadeIn>

        {/* Architecture diagram */}
        {project.architecture && project.architecture.length > 0 && (
          <FadeIn delay={0.12}>
            <section className="mt-8 rounded-2xl p-8 border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Layers size={18} className={a.text} /> {u.arch}
              </h2>
              <div className="space-y-1">
                {project.architecture.map((layer, li) => (
                  <div key={layer.title}>
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: li * 0.06 }}
                      className={`rounded-xl border ${a.border} bg-slate-900/40 p-4`}
                    >
                      <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-3">{`> ${tr(layer.title, lang)}`}</div>
                      <div className="flex flex-wrap gap-2">
                        {layer.nodes.map((node) => {
                          const NIcon = NODE_ICONS[node.label] || Server
                          return (
                            <div key={node.label} className={`flex-1 min-w-[120px] rounded-lg ${a.bg} border ${a.border} px-3 py-2.5 flex items-center gap-2.5 ${a.hoverGlow} transition-shadow`}>
                              <NIcon size={18} className={`${a.text} flex-shrink-0`} />
                              <div className="min-w-0">
                                <div className="text-sm font-semibold text-white truncate">{node.label}</div>
                                {node.sub && <div className="text-[10px] text-slate-400 truncate">{node.sub}</div>}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </motion.div>
                    {li < project.architecture!.length - 1 && (
                      <div className="relative flex justify-center h-7">
                        <div className="w-px h-full" style={{ background: `linear-gradient(to bottom, transparent, rgba(${a.rgb},0.5), transparent)` }} />
                        <motion.div
                          className="absolute w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: `rgb(${a.rgb})`, boxShadow: `0 0 8px rgb(${a.rgb})` }}
                          animate={{ y: [0, 28], opacity: [0, 1, 0] }}
                          transition={{ duration: 1.6, repeat: Infinity, delay: li * 0.3, ease: "easeInOut" }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </FadeIn>
        )}

        {/* Modules / Services grid */}
        {project.moduleGroups && project.moduleGroups.length > 0 && (
          <FadeIn delay={0.14}>
            <section className="mt-8 rounded-2xl p-8 border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Boxes size={18} className={a.text} /> {u.modules}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.moduleGroups.map((g, gi) => {
                  const Icon = ICONS[g.icon || "Boxes"] || Boxes
                  return (
                    <motion.div
                      key={g.title}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: gi * 0.05 }}
                      whileHover={{ y: -3 }}
                      className={`rounded-xl border border-slate-700/50 bg-slate-900/40 p-4 ${a.hoverBorder} transition-colors`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`w-8 h-8 rounded-lg bg-gradient-to-br ${a.grad} flex items-center justify-center`}>
                          <Icon size={16} className="text-white" />
                        </span>
                        <h3 className="text-sm font-semibold text-white">{tr(g.title, lang)}</h3>
                        <span className="ml-auto text-[10px] font-mono text-slate-500">{g.items.length}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {g.items.map((it) => (
                          <span key={it} className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50">
                            <span className="w-1 h-1 rounded-full" style={{ backgroundColor: `rgb(${a.rgb})` }} />{it}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </section>
          </FadeIn>
        )}

        {/* Features */}
        <FadeIn delay={0.15}>
          <section className="mt-8 rounded-2xl p-8 border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
              <CheckCircle2 size={18} className={a.text} /> {u.features}
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {project.features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ x: 4 }}
                  className={`flex items-start gap-3 text-slate-300 text-sm bg-slate-900/40 rounded-xl p-4 border border-slate-700/40 ${a.hoverBorder} transition-colors`}
                >
                  <CheckCircle2 size={18} className={`${a.text} flex-shrink-0 mt-0.5`} />
                  <span>{tr(f, lang)}</span>
                </motion.div>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* Highlights */}
        {project.highlights && project.highlights.length > 0 && (
          <FadeIn delay={0.2}>
            <section className={`mt-8 rounded-2xl p-8 border ${a.border} bg-gradient-to-br from-slate-800/50 to-slate-900/30 backdrop-blur-sm`}>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles size={18} className={a.text} /> {u.highlights}
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {project.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-3 text-slate-200 text-sm bg-slate-900/40 rounded-xl p-4 border border-slate-700/30">
                    <Sparkles size={16} className={`${a.text} flex-shrink-0 mt-0.5`} />
                    <span>{tr(h, lang)}</span>
                  </div>
                ))}
              </div>
            </section>
          </FadeIn>
        )}
      </div>
    </div>
  )
}
