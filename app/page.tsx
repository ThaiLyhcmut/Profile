"use client"

import { useEffect, useState, useRef } from "react"
import { Github, Mail, ExternalLink, Star, MapPin, Phone, Calendar, GraduationCap, Briefcase, Code2, Server, Database, Cloud, ChevronDown, Building2, Activity } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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
    { name: "Golang", color: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" },
    { name: "JavaScript", color: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" },
    { name: "TypeScript", color: "bg-blue-500/20 text-blue-400 border border-blue-500/30" },
    { name: "Python", color: "bg-green-500/20 text-green-400 border border-green-500/30" },
    { name: "Solidity", color: "bg-gray-500/20 text-gray-400 border border-gray-500/30" },
  ],
  backend: [
    { name: "Gin", color: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" },
    { name: "Express.js", color: "bg-gray-500/20 text-gray-300 border border-gray-500/30" },
    { name: "FastAPI", color: "bg-teal-500/20 text-teal-400 border border-teal-500/30" },
    { name: "Node.js", color: "bg-green-600/20 text-green-400 border border-green-600/30" },
  ],
  api: [
    { name: "gRPC", color: "bg-blue-500/20 text-blue-400 border border-blue-500/30" },
    { name: "GraphQL", color: "bg-pink-500/20 text-pink-400 border border-pink-500/30" },
    { name: "REST API", color: "bg-orange-500/20 text-orange-400 border border-orange-500/30" },
    { name: "WebSocket", color: "bg-purple-500/20 text-purple-400 border border-purple-500/30" },
    { name: "MQTT", color: "bg-violet-500/20 text-violet-400 border border-violet-500/30" },
  ],
  messageQueue: [
    { name: "Apache Kafka", color: "bg-orange-600/20 text-orange-400 border border-orange-600/30" },
    { name: "BullMQ", color: "bg-red-500/20 text-red-400 border border-red-500/30" },
    { name: "Redis Pub/Sub", color: "bg-red-600/20 text-red-400 border border-red-600/30" },
  ],
  databases: [
    { name: "PostgreSQL", color: "bg-blue-700/20 text-blue-300 border border-blue-700/30" },
    { name: "MySQL", color: "bg-blue-600/20 text-blue-400 border border-blue-600/30" },
    { name: "MongoDB", color: "bg-green-700/20 text-green-300 border border-green-700/30" },
    { name: "Redis", color: "bg-red-600/20 text-red-400 border border-red-600/30" },
    { name: "Elasticsearch", color: "bg-yellow-600/20 text-yellow-400 border border-yellow-600/30" },
  ],
  devops: [
    { name: "Docker", color: "bg-blue-500/20 text-blue-400 border border-blue-500/30" },
    { name: "Nginx", color: "bg-green-600/20 text-green-400 border border-green-600/30" },
    { name: "MinIO", color: "bg-red-500/20 text-red-400 border border-red-500/30" },
    { name: "Portainer", color: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" },
  ],
  cloud: [
    { name: "AWS", color: "bg-orange-500/20 text-orange-400 border border-orange-500/30" },
    { name: "Azure", color: "bg-blue-600/20 text-blue-400 border border-blue-600/30" },
    { name: "Google Cloud", color: "bg-red-500/20 text-red-400 border border-red-500/30" },
  ],
  monitoring: [
    { name: "Grafana", color: "bg-orange-500/20 text-orange-400 border border-orange-500/30" },
    { name: "Prometheus", color: "bg-orange-600/20 text-orange-400 border border-orange-600/30" },
    { name: "Loki", color: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" },
    { name: "Kibana", color: "bg-pink-500/20 text-pink-400 border border-pink-500/30" },
  ],
}

const EXPERIENCE = [
  {
    title: "Backend Developer Intern",
    company: "MangoAds",
    location: "Ho Chi Minh City",
    period: "04/2025 - Present",
    description: [
      "Developing core backend for VPBank project using Node.js",
      "Building reusable core framework for internal projects",
      "Working with RESTful APIs, performance optimization, security best practices",
    ],
    type: "work" as const,
  },
  {
    title: "Thesis Management System",
    company: "Graduation Project - HCMUT",
    location: "Personal Project",
    period: "10/2025 - Present",
    description: [
      "Architecting microservices with 6 gRPC services (Golang), AI/ML service (Python), GraphQL Gateway",
      "Implementing AI plagiarism detection with OCR, Elasticsearch, Vector Embeddings (bge-m3)",
      "Building async job processing with Node.js/BullMQ for background tasks",
    ],
    type: "project" as const,
  },
]

export default function Portfolio() {
  const [projects, setProjects] = useState<GitHubProject[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState("about")
  const [isVisible, setIsVisible] = useState(false)

  const aboutRef = useRef<HTMLElement>(null)
  const skillsRef = useRef<HTMLElement>(null)
  const experienceRef = useRef<HTMLElement>(null)
  const projectsRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setIsVisible(true)
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
    // Use static data to avoid GitHub API rate limiting on production
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
    return PROJECT_DETAILS[`${owner}/${name}`]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-12">
              <div className={`transform transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
                {/* Profile Card */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 mb-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-cyan-500/25">LT</div>
                    <div>
                      <h1 className="text-2xl font-bold text-white">Ly Vinh Thai</h1>
                      <p className="text-cyan-400 font-medium">Backend & DevOps</p>
                      <span className="inline-block mt-1 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">Open to Work</span>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <a href="tel:0366063879" className="flex items-center gap-3 text-slate-400 hover:text-cyan-400 transition group">
                      <Phone size={16} className="text-cyan-400 group-hover:scale-110 transition" />
                      <span>0366 063 879</span>
                    </a>
                    <a href="mailto:lyvinhthai321@gmail.com" className="flex items-center gap-3 text-slate-400 hover:text-cyan-400 transition group">
                      <Mail size={16} className="text-cyan-400 group-hover:scale-110 transition" />
                      <span>lyvinhthai321@gmail.com</span>
                    </a>
                    <div className="flex items-center gap-3 text-slate-400">
                      <MapPin size={16} className="text-cyan-400" />
                      <span>Thu Duc City, Ho Chi Minh</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                      <Calendar size={16} className="text-cyan-400" />
                      <span>08/04/2004</span>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 mb-6">
                  <ul className="space-y-1">
                    {[
                      { id: "about", label: "About", icon: Code2 },
                      { id: "skills", label: "Skills", icon: Server },
                      { id: "experience", label: "Experience", icon: Briefcase },
                      { id: "projects", label: "Projects", icon: Github },
                    ].map((item) => (
                      <li key={item.id}>
                        <a href={`#${item.id}`} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeSection === item.id ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-slate-400 hover:text-white hover:bg-slate-700/50"}`}>
                          <item.icon size={18} />
                          <span className="font-medium">{item.label}</span>
                          {activeSection === item.id && <ChevronDown size={16} className="ml-auto rotate-[-90deg]" />}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Social Links */}
                <div className="flex gap-3">
                  <a href="https://github.com/ThaiLyhcmut" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-white hover:border-cyan-500/50 transition-all group">
                    <Github size={20} className="group-hover:scale-110 transition" />
                    <span className="text-sm font-medium">GitHub</span>
                  </a>
                  <a href="https://github.com/orgs/cms-lvtn-2025" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-white hover:border-cyan-500/50 transition-all group">
                    <Building2 size={20} className="group-hover:scale-110 transition" />
                    <span className="text-sm font-medium">Org</span>
                  </a>
                  <a href="mailto:lyvinhthai321@gmail.com" className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:opacity-90 transition-all group">
                    <Mail size={20} className="group-hover:scale-110 transition" />
                    <span className="text-sm font-medium">Hire</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-16">
            {/* About Section */}
            <section ref={aboutRef} id="about" className={`scroll-mt-8 transform transition-all duration-700 delay-100 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/30">
                  <Code2 size={24} className="text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">About Me</h2>
                  <p className="text-slate-400 text-sm">Backend Developer & DevOps Engineer</p>
                </div>
              </div>
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
                <div className="space-y-4 text-slate-300 leading-relaxed">
                  <p>I&apos;m a <strong className="text-cyan-400">4th-year Computer Science student</strong> at Ho Chi Minh City University of Technology (HCMUT), passionate about building scalable backend systems and cloud-native solutions.</p>
                  <p>Currently expanding expertise in <strong className="text-white">distributed systems</strong>, <strong className="text-white">microservices architecture</strong>, and <strong className="text-white">high-performance computing</strong>. Experienced with gRPC, GraphQL, message queues (Kafka, BullMQ), and container orchestration.</p>
                  <p>I enjoy solving complex problems, optimizing performance, and designing robust architectures.</p>
                </div>
                {/* Education */}
                <div className="mt-8 pt-8 border-t border-slate-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <GraduationCap size={20} className="text-cyan-400" />
                    <h3 className="text-lg font-semibold text-white">Education</h3>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/30">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-white">Ho Chi Minh City University of Technology</h4>
                        <p className="text-cyan-400 text-sm">Computer Science / Software Engineering</p>
                        <p className="text-slate-400 text-sm mt-1">4th Year Student</p>
                      </div>
                      <span className="text-sm text-slate-400 bg-slate-800 px-3 py-1 rounded-full">2022 - Present</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Skills Section */}
            <section ref={skillsRef} id="skills" className={`scroll-mt-8 transform transition-all duration-700 delay-200 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/30">
                  <Server size={24} className="text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Technical Skills</h2>
                  <p className="text-slate-400 text-sm">Technologies I work with</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="text-sm font-semibold text-cyan-400 mb-4 uppercase tracking-wide flex items-center gap-2"><Code2 size={16} /> Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.languages.map((skill) => (<span key={skill.name} className={`text-sm px-3 py-1.5 rounded-lg font-medium ${skill.color} hover:scale-105 transition-transform cursor-default`}>{skill.name}</span>))}
                  </div>
                </div>
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="text-sm font-semibold text-green-400 mb-4 uppercase tracking-wide flex items-center gap-2"><Server size={16} /> Backend Frameworks</h3>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.backend.map((skill) => (<span key={skill.name} className={`text-sm px-3 py-1.5 rounded-lg font-medium ${skill.color} hover:scale-105 transition-transform cursor-default`}>{skill.name}</span>))}
                  </div>
                </div>
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="text-sm font-semibold text-pink-400 mb-4 uppercase tracking-wide flex items-center gap-2"><ExternalLink size={16} /> API & Communication</h3>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.api.map((skill) => (<span key={skill.name} className={`text-sm px-3 py-1.5 rounded-lg font-medium ${skill.color} hover:scale-105 transition-transform cursor-default`}>{skill.name}</span>))}
                  </div>
                </div>
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="text-sm font-semibold text-orange-400 mb-4 uppercase tracking-wide flex items-center gap-2"><Server size={16} /> Message Queue</h3>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.messageQueue.map((skill) => (<span key={skill.name} className={`text-sm px-3 py-1.5 rounded-lg font-medium ${skill.color} hover:scale-105 transition-transform cursor-default`}>{skill.name}</span>))}
                  </div>
                </div>
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="text-sm font-semibold text-blue-400 mb-4 uppercase tracking-wide flex items-center gap-2"><Database size={16} /> Databases</h3>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.databases.map((skill) => (<span key={skill.name} className={`text-sm px-3 py-1.5 rounded-lg font-medium ${skill.color} hover:scale-105 transition-transform cursor-default`}>{skill.name}</span>))}
                  </div>
                </div>
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="text-sm font-semibold text-blue-400 mb-4 uppercase tracking-wide flex items-center gap-2"><Cloud size={16} /> DevOps & Tools</h3>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.devops.map((skill) => (<span key={skill.name} className={`text-sm px-3 py-1.5 rounded-lg font-medium ${skill.color} hover:scale-105 transition-transform cursor-default`}>{skill.name}</span>))}
                  </div>
                </div>
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="text-sm font-semibold text-orange-400 mb-4 uppercase tracking-wide flex items-center gap-2"><Cloud size={16} /> Cloud Platforms</h3>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.cloud.map((skill) => (<span key={skill.name} className={`text-sm px-3 py-1.5 rounded-lg font-medium ${skill.color} hover:scale-105 transition-transform cursor-default`}>{skill.name}</span>))}
                  </div>
                </div>
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="text-sm font-semibold text-yellow-400 mb-4 uppercase tracking-wide flex items-center gap-2"><Server size={16} /> Monitoring</h3>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.monitoring.map((skill) => (<span key={skill.name} className={`text-sm px-3 py-1.5 rounded-lg font-medium ${skill.color} hover:scale-105 transition-transform cursor-default`}>{skill.name}</span>))}
                  </div>
                </div>
              </div>
            </section>

            {/* Experience Section */}
            <section ref={experienceRef} id="experience" className={`scroll-mt-8 transform transition-all duration-700 delay-300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/30">
                  <Briefcase size={24} className="text-purple-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Experience</h2>
                  <p className="text-slate-400 text-sm">Work & Major Projects</p>
                </div>
              </div>
              <div className="space-y-6">
                {EXPERIENCE.map((exp, index) => (
                  <div key={index} className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-500/30 transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${exp.type === "work" ? "bg-green-500/20 border border-green-500/30" : "bg-blue-500/20 border border-blue-500/30"}`}>
                          {exp.type === "work" ? <Briefcase size={20} className="text-green-400" /> : <Code2 size={20} className="text-blue-400" />}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition">{exp.title}</h3>
                          <p className={`font-medium ${exp.type === "work" ? "text-green-400" : "text-blue-400"}`}>{exp.company}</p>
                          <p className="text-slate-400 text-sm flex items-center gap-2 mt-1"><MapPin size={14} /> {exp.location}</p>
                        </div>
                      </div>
                      <span className="text-sm text-slate-400 bg-slate-800 px-3 py-1 rounded-full whitespace-nowrap">{exp.period}</span>
                    </div>
                    <ul className="space-y-2 ml-16">
                      {exp.description.map((item, i) => (<li key={i} className="text-slate-300 text-sm flex items-start gap-2"><span className="text-cyan-400 mt-1.5">-</span> {item}</li>))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects Section */}
            <section ref={projectsRef} id="projects" className={`scroll-mt-8 transform transition-all duration-700 delay-400 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-xl bg-orange-500/20 border border-orange-500/30">
                  <Github size={24} className="text-orange-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">GitHub Projects</h2>
                  <p className="text-slate-400 text-sm">Featured repositories ({projects.length})</p>
                </div>
              </div>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="flex items-center gap-3 text-slate-400">
                    <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    Loading projects...
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {projects.map((project) => {
                    const details = getProjectDetails(project.owner, project.name)
                    return (
                      <Card key={project.id} className="bg-slate-800/30 backdrop-blur-sm border-slate-700/50 hover:border-cyan-500/50 transition-all group">
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition">{details?.title || project.name}</h3>
                                {project.stargazers_count > 0 && (<div className="flex items-center gap-1 text-sm text-yellow-400"><Star size={14} fill="currentColor" /> {project.stargazers_count}</div>)}
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">{project.owner}/{project.name}</p>
                            </div>
                            <a href={project.url} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="sm" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 bg-transparent">
                                <ExternalLink size={14} className="mr-1" /> View
                              </Button>
                            </a>
                          </div>
                          <p className="text-slate-400 text-sm mb-4">{details?.description || project.description || "No description"}</p>
                          <div className="flex flex-wrap gap-2">
                            {(details?.tech || [project.language]).filter(Boolean).map((tech) => (<span key={tech} className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded border border-cyan-500/30">{tech}</span>))}
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
            </section>

            {/* GitHub Stats Section */}
            <section className={`scroll-mt-8 transform transition-all duration-700 delay-500 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-xl bg-green-500/20 border border-green-500/30">
                  <Activity size={24} className="text-green-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">GitHub Activity</h2>
                  <p className="text-slate-400 text-sm">Contributions & Statistics</p>
                </div>
              </div>

              <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 overflow-hidden">
                <div className="flex justify-center">
                  <img
                    src="https://ghchart.rshah.org/00d4aa/thailyhcmut"
                    alt="GitHub Contribution Graph"
                    className="w-full max-w-2xl rounded-lg"
                  />
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="text-center py-8 border-t border-slate-800">
              <p className="text-slate-500 text-sm">Built with Next.js & TailwindCSS | Ly Vinh Thai &copy; {new Date().getFullYear()}</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}
