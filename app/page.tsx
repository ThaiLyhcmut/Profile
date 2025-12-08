"use client"

import { useEffect, useState } from "react"
import { Github, Mail, ExternalLink, Star, MapPin, Phone, Calendar } from "lucide-react"
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
  { owner: "ThaiLyhcmut", repo: "DAPM-BE" },
  { owner: "ThaiLyhcmut", repo: "API-mark" },
  { owner: "ThaiLyhcmut", repo: "buy-tours" },
  { owner: "ThaiLyhcmut", repo: "app-music" },
  { owner: "ThaiLyhcmut", repo: "BE_product_update" },
  { owner: "cms-lvtn-2025", repo: "fe_new" },
  { owner: "cms-lvtn-2025", repo: "plagiarism" },
  { owner: "cms-lvtn-2025", repo: "fe_admin" },
  { owner: "cms-lvtn-2025", repo: "be_queue" },
  { owner: "cms-lvtn-2025", repo: "be-lvtn" },
]

const SKILLS = {
  languages: [
    { name: "JavaScript", color: "bg-yellow-500/20 text-yellow-400" },
    { name: "TypeScript", color: "bg-blue-500/20 text-blue-400" },
    { name: "Golang", color: "bg-cyan-500/20 text-cyan-400" },
    { name: "Python", color: "bg-blue-600/20 text-blue-500" },
    { name: "Solidity", color: "bg-gray-500/20 text-gray-400" },
  ],
  frontend: [
    { name: "React", color: "bg-blue-400/20 text-blue-300" },
    { name: "Next.js", color: "bg-black/40 text-gray-200" },
    { name: "React Native", color: "bg-blue-400/20 text-blue-300" },
    { name: "TailwindCSS", color: "bg-cyan-500/20 text-cyan-400" },
    { name: "Material UI", color: "bg-blue-600/20 text-blue-400" },
  ],
  backend: [
    { name: "Node.js", color: "bg-green-600/20 text-green-400" },
    { name: "Express.js", color: "bg-gray-500/20 text-gray-300" },
    { name: "FastAPI", color: "bg-teal-500/20 text-teal-400" },
    { name: "Gin", color: "bg-cyan-500/20 text-cyan-400" },
    { name: "GraphQL", color: "bg-pink-500/20 text-pink-400" },
    { name: "gRPC", color: "bg-blue-500/20 text-blue-400" },
  ],
  databases: [
    { name: "PostgreSQL", color: "bg-blue-700/20 text-blue-300" },
    { name: "MongoDB", color: "bg-green-700/20 text-green-300" },
    { name: "Redis", color: "bg-red-600/20 text-red-400" },
    { name: "MySQL", color: "bg-blue-600/20 text-blue-400" },
    { name: "Elasticsearch", color: "bg-yellow-600/20 text-yellow-400" },
  ],
  devops: [
    { name: "Docker", color: "bg-blue-500/20 text-blue-400" },
    { name: "Nginx", color: "bg-green-600/20 text-green-400" },
    { name: "AWS", color: "bg-orange-500/20 text-orange-400" },
    { name: "Azure", color: "bg-blue-600/20 text-blue-400" },
    { name: "Google Cloud", color: "bg-red-500/20 text-red-400" },
  ],
}

export default function Portfolio() {
  const [projects, setProjects] = useState<GitHubProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGitHubProjects = async () => {
      try {
        const allProjects: GitHubProject[] = []

        for (const { owner, repo } of FEATURED_REPOS) {
          try {
            const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`)
            if (res.ok) {
              const data = await res.json()
              allProjects.push({
                id: data.id,
                name: data.name,
                description: data.description,
                url: data.html_url,
                language: data.language,
                stargazers_count: data.stargazers_count,
                topics: data.topics || [],
                owner: data.owner.login,
              })
            }
          } catch (error) {
            console.error(`Error fetching ${owner}/${repo}:`, error)
          }
        }

        setProjects(allProjects)
      } catch (error) {
        console.error("Error fetching GitHub projects:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGitHubProjects()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h1 className="text-4xl font-bold text-white mb-1">Lý Vĩnh Thái</h1>
              <p className="text-lg text-cyan-400 font-medium mb-1">Backend Developer & DevOps Engineer</p>
              <p className="text-sm text-slate-400 mb-8">(Fresher)</p>

              <div className="space-y-2 mb-8 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-cyan-400" />
                  <span>0366 063 879</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-cyan-400" />
                  <a href="mailto:lyvinhthai321@gmail.com" className="hover:text-cyan-400 transition">
                    lyvinhthai321@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-cyan-400" />
                  <span>TP. Thủ Đức, TP.HCM</span>
                </div>
              </div>

              <nav className="space-y-3 mb-12 border-l-2 border-cyan-400/30 pl-4">
                <a href="#about" className="block text-slate-400 hover:text-cyan-400 transition">
                  ABOUT
                </a>
                <a href="#skills" className="block text-slate-400 hover:text-cyan-400 transition">
                  SKILLS
                </a>
                <a href="#experience" className="block text-slate-400 hover:text-cyan-400 transition">
                  EXPERIENCE
                </a>
                <a href="#projects" className="block text-slate-400 hover:text-cyan-400 transition">
                  PROJECTS
                </a>
              </nav>

              {/* Social Links */}
              <div className="flex gap-4 mb-8">
                <a
                  href="https://github.com/ThaiLyhcmut"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-400 transition"
                  title="Personal GitHub"
                >
                  <Github size={20} />
                </a>
                <a
                  href="https://github.com/orgs/cms-lvtn-2025"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-400 transition"
                  title="Organization GitHub"
                >
                  <Github size={20} />
                </a>
                <a
                  href="mailto:lyvinhthai321@gmail.com"
                  className="p-2 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-400 transition"
                  title="Email"
                >
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            {/* About Section */}
            <section id="about" className="scroll-mt-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-cyan-400"></span>
                About
              </h2>
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Xin chào! Tôi là một lập trình viên <strong>Fullstack & DevOps</strong>, có kinh nghiệm phát triển hệ
                  thống quản lý, ứng dụng web và mobile. Tôi là sinh viên tại Trường Đại Học Bách Khoa TPHCM.
                </p>
                <p>
                  Hiện tại, tôi đang mở rộng chuyên môn trong các lĩnh vực <strong>gRPC, GraphQL, Proto, Redis</strong>{" "}
                  và hệ thống <strong>phân tán hiệu năng cao</strong>. Tôi yêu thích giải quyết những vấn đề phức tạp,
                  tối ưu hóa hiệu năng, và thiết kế các kiến trúc mạnh mẽ cho ứng dụng.
                </p>
                <p>
                  Khi không lập trình, tôi thích đọc về công nghệ mới, đóng góp cho các dự án mã nguồn mở, và tìm hiểu
                  về những xu hướng mới trong ngành phát triển phần mềm.
                </p>
              </div>
            </section>

            {/* Skills Section */}
            <section id="skills" className="scroll-mt-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-cyan-400"></span>
                Skills
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-cyan-400 mb-3 uppercase tracking-wide">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.languages.map((skill) => (
                      <span key={skill.name} className={`text-sm px-3 py-1 rounded-full font-medium ${skill.color}`}>
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-cyan-400 mb-3 uppercase tracking-wide">Frontend</h3>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.frontend.map((skill) => (
                      <span key={skill.name} className={`text-sm px-3 py-1 rounded-full font-medium ${skill.color}`}>
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-cyan-400 mb-3 uppercase tracking-wide">Backend & APIs</h3>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.backend.map((skill) => (
                      <span key={skill.name} className={`text-sm px-3 py-1 rounded-full font-medium ${skill.color}`}>
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-cyan-400 mb-3 uppercase tracking-wide">Databases</h3>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.databases.map((skill) => (
                      <span key={skill.name} className={`text-sm px-3 py-1 rounded-full font-medium ${skill.color}`}>
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-cyan-400 mb-3 uppercase tracking-wide">DevOps & Cloud</h3>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.devops.map((skill) => (
                      <span key={skill.name} className={`text-sm px-3 py-1 rounded-full font-medium ${skill.color}`}>
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Experience Section */}
            <section id="experience" className="scroll-mt-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-cyan-400"></span>
                Experience
              </h2>
              <div className="space-y-6">
                <div className="border-l-2 border-cyan-400/50 pl-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Backend Developer & DevOps Engineer</h3>
                      <p className="text-cyan-400 font-medium">CMS LVTN 2025 Organization</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Calendar size={16} />
                      <span>2024 - Present</span>
                    </div>
                  </div>
                  <p className="text-slate-300 mt-3">
                    Phát triển các hệ thống backend sử dụng Golang, Node.js, GraphQL và gRPC. Quản lý infrastructure với
                    Docker, Kubernetes, và các cloud platforms. Tối ưu hóa hiệu năng database và thiết kế các hệ thống
                    phân tán.
                  </p>
                </div>

                <div className="border-l-2 border-cyan-400/50 pl-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Fullstack Developer</h3>
                      <p className="text-cyan-400 font-medium">Personal Projects & Open Source</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Calendar size={16} />
                      <span>2023 - Present</span>
                    </div>
                  </div>
                  <p className="text-slate-300 mt-3">
                    Xây dựng các ứng dụng web đầy đủ sử dụng Next.js, React, TypeScript. Phát triển mobile apps với
                    React Native và Expo. Đóng góp cho các dự án mã nguồn mở.
                  </p>
                </div>
              </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="scroll-mt-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-cyan-400"></span>
                Projects ({projects.length})
              </h2>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="text-slate-400">Đang tải projects...</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map((project) => (
                    <Card
                      key={project.id}
                      className="bg-slate-700/50 border-slate-600/50 hover:border-cyan-400/50 transition group cursor-pointer overflow-hidden"
                    >
                      <div className="p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition">
                              {project.name}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">{project.owner}</p>
                          </div>
                          {project.stargazers_count > 0 && (
                            <div className="flex items-center gap-1 text-sm text-slate-400">
                              <Star size={16} />
                              {project.stargazers_count}
                            </div>
                          )}
                        </div>

                        {project.description && (
                          <p className="text-slate-400 text-sm line-clamp-2">{project.description}</p>
                        )}

                        <div className="flex flex-wrap gap-2">
                          {project.language && (
                            <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded">
                              {project.language}
                            </span>
                          )}
                          {project.topics.slice(0, 2).map((topic) => (
                            <span key={topic} className="text-xs bg-slate-600/50 text-slate-300 px-2 py-1 rounded">
                              {topic}
                            </span>
                          ))}
                        </div>

                        <a href={project.url} target="_blank" rel="noopener noreferrer">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 group-hover:border-cyan-400 bg-transparent"
                          >
                            <ExternalLink size={16} className="mr-2" />
                            View on GitHub
                          </Button>
                        </a>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
