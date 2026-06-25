"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

type Language = 'en' | 'vi'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  en: {
    // Header
    'header.role': 'Backend & DevOps',
    'header.openToWork': 'Open to Work',

    // Navigation
    'nav.about': 'About',
    'nav.skills': 'Skills',
    'nav.experience': 'Experience',
    'nav.projects': 'Projects',

    // Social
    'social.github': 'GitHub',
    'social.org': 'Org',
    'social.hire': 'Hire',

    // About Section
    'about.title': 'About Me',
    'about.subtitle': 'Backend Developer & DevOps Engineer',
    'about.intro1': "I'm a <strong>4th-year Computer Science student</strong> at HCMUT and a <strong>backend & DevOps engineer</strong> who ships real production systems — not just coursework.",
    'about.intro2': "I build <strong>distributed systems</strong> and <strong>microservices</strong> running in production for banks and enterprises: a Telegram automation platform serving <strong>100k+ users</strong>, a MongoREST CMS core used by VPBank, ACB and more, my own gRPC code-generator, and end-to-end AI content pipelines.",
    'about.intro3': "Core stack: Go, gRPC, GraphQL, MongoDB, Redis, Kafka/BullMQ, Docker and full observability (Prometheus, Loki, Grafana). I love hard problems, performance and clean architecture.",
    'about.education': 'Education',
    'about.university': 'Ho Chi Minh City University of Technology',
    'about.major': 'Computer Science / Software Engineering',
    'about.year': '4th Year Student',
    'about.period': '2022 - Present',

    // Skills Section
    'skills.title': 'Technical Skills',
    'skills.subtitle': 'Technologies I work with',
    'skills.languages': 'Languages',
    'skills.backend': 'Backend',
    'skills.api': 'API',
    'skills.messageQueue': 'MessageQueue',
    'skills.databases': 'Databases',
    'skills.devops': 'Devops',
    'skills.cloud': 'Cloud',
    'skills.monitoring': 'Monitoring',

    // Experience Section
    'experience.title': 'Experience',
    'experience.subtitle': 'Work & Major Projects',
    'experience.mangoads.title': 'Backend Developer',
    'experience.mangoads.company': 'MangoAds',
    'experience.mangoads.period': '04/2025 - Present',
    'experience.mangoads.desc1': 'Backend developer building CMS & CRM systems for enterprise clients: VPBank, ACB, TH True Milk, Dinh Group, Inoue, Kewpie',
    'experience.mangoads.desc2': 'Developing scalable backend services with high availability and security compliance',
    'experience.mangoads.desc3': 'Building & owning a reusable core CMS (MongoREST) + plugin system shared across projects (Fastify, TypeScript, MongoDB)',
    'experience.mangoads.desc4': 'Implementing performance optimization, caching strategies, and security best practices',
    'experience.covergo.title': '3rd Place — AI Hackathon',
    'experience.covergo.company': 'CoverGo AI Hackathon',
    'experience.covergo.location': 'CoverGo',
    'experience.covergo.period': '2025',
    'experience.covergo.desc1': 'Won 3rd place at the AI Hackathon organized by CoverGo (2025)',
    'experience.covergo.desc2': 'Built an AI solution with the team under a tight time limit',

    // Projects Section
    'projects.title': 'GitHub Projects',
    'projects.subtitle': 'Featured repositories',
    'projects.loading': 'Loading projects...',
    'projects.view': 'View',
    'projects.noDescription': 'No description',

    // GitHub Activity
    'activity.title': 'GitHub Activity',
    'activity.subtitle': 'Contributions & Statistics',

    // Footer
    'footer.builtWith': 'Built with Next.js, Three.js & Framer Motion',

    // Project Details
    'project.be-lvtn.title': 'Thesis Management - Core Services',
    'project.be-lvtn.desc': '6 gRPC microservices (user, role, academic, thesis, council, file) with MySQL',
    'project.be_queue.title': 'Thesis Management - Job Queue',
    'project.be_queue.desc': 'Async job processing with BullMQ for plagiarism check, file generation, grade calculation',
    'project.plagiarism.title': 'AI Plagiarism Detection',
    'project.plagiarism.desc': 'OCR + Deep Learning, Elasticsearch full-text search, Vector Embeddings (bge-m3)',
    'project.fe_new.title': 'Thesis Management - Frontend',
    'project.fe_new.desc': 'Next.js frontend for Students, Lecturers, Academic Affairs Staff, Department Heads',
    'project.fe_admin.title': 'Admin & Workflow Console',
    'project.fe_admin.desc': 'Admin frontend for Super Admins to configure workflows and monitor BullMQ jobs',
    'project.DAPM-BE.title': 'Smart Home IoT System',
    'project.DAPM-BE.desc': 'GraphQL API for smart home with real-time notifications, microservices, MQTT for IoT',
    'project.BE_product_update.title': 'E-commerce Platform',
    'project.BE_product_update.desc': 'Online shopping with real-time chat (WebSocket), OTP auth, admin dashboard',
  },
  vi: {
    // Header
    'header.role': 'Backend & DevOps',
    'header.openToWork': 'Sẵn sàng làm việc',

    // Navigation
    'nav.about': 'Giới thiệu',
    'nav.skills': 'Kỹ năng',
    'nav.experience': 'Kinh nghiệm',
    'nav.projects': 'Dự án',

    // Social
    'social.github': 'GitHub',
    'social.org': 'Tổ chức',
    'social.hire': 'Thuê',

    // About Section
    'about.title': 'Giới thiệu',
    'about.subtitle': 'Backend Developer & DevOps Engineer',
    'about.intro1': "Tôi là <strong>sinh viên năm 4 ngành Khoa học Máy tính</strong> tại Đại học Bách Khoa TP.HCM, đồng thời là một <strong>backend & DevOps engineer</strong> đã đưa nhiều hệ thống chạy thật lên production — không chỉ là bài tập.",
    'about.intro2': "Tôi xây <strong>hệ thống phân tán</strong> và <strong>microservices</strong> chạy thật cho ngân hàng và doanh nghiệp: nền tảng tự động hoá Telegram phục vụ <strong>100k+ người dùng</strong>, một CMS core MongoREST đang dùng ở VPBank, ACB..., bộ sinh code gRPC của riêng tôi, và các pipeline AI tạo nội dung end-to-end.",
    'about.intro3': "Stack chính: Go, gRPC, GraphQL, MongoDB, Redis, Kafka/BullMQ, Docker và observability đầy đủ (Prometheus, Loki, Grafana). Tôi thích bài toán khó, tối ưu hiệu suất và kiến trúc sạch.",
    'about.education': 'Học vấn',
    'about.university': 'Đại học Bách Khoa TP. Hồ Chí Minh',
    'about.major': 'Khoa học Máy tính / Kỹ thuật Phần mềm',
    'about.year': 'Sinh viên năm 4',
    'about.period': '2022 - Hiện tại',

    // Skills Section
    'skills.title': 'Kỹ năng Kỹ thuật',
    'skills.subtitle': 'Công nghệ tôi sử dụng',
    'skills.languages': 'Ngôn ngữ',
    'skills.backend': 'Backend',
    'skills.api': 'API',
    'skills.messageQueue': 'Message Queue',
    'skills.databases': 'Cơ sở dữ liệu',
    'skills.devops': 'DevOps',
    'skills.cloud': 'Cloud',
    'skills.monitoring': 'Giám sát',

    // Experience Section
    'experience.title': 'Kinh nghiệm',
    'experience.subtitle': 'Công việc & Dự án Chính',
    'experience.mangoads.title': 'Backend Developer',
    'experience.mangoads.company': 'MangoAds',
    'experience.mangoads.period': '04/2025 - Hiện tại',
    'experience.mangoads.desc1': 'Backend developer xây dựng hệ thống CMS & CRM cho khách hàng doanh nghiệp: VPBank, ACB, TH True Milk, Dinh Group, Inoue, Kewpie',
    'experience.mangoads.desc2': 'Phát triển backend services có khả năng mở rộng với high availability và security compliance',
    'experience.mangoads.desc3': 'Xây dựng & phụ trách core CMS (MongoREST) + hệ thống plugin tái sử dụng cho nhiều dự án (Fastify, TypeScript, MongoDB)',
    'experience.mangoads.desc4': 'Triển khai tối ưu hiệu suất, caching strategies, và security best practices',
    'experience.covergo.title': 'Giải Ba — AI Hackathon',
    'experience.covergo.company': 'CoverGo AI Hackathon',
    'experience.covergo.location': 'CoverGo',
    'experience.covergo.period': '2025',
    'experience.covergo.desc1': 'Đạt Giải Ba tại cuộc thi AI Hackathon do CoverGo tổ chức (2025)',
    'experience.covergo.desc2': 'Cùng đội xây dựng giải pháp AI trong thời gian giới hạn',

    // Projects Section
    'projects.title': 'Dự án GitHub',
    'projects.subtitle': 'Repositories nổi bật',
    'projects.loading': 'Đang tải dự án...',
    'projects.view': 'Xem',
    'projects.noDescription': 'Chưa có mô tả',

    // GitHub Activity
    'activity.title': 'Hoạt động GitHub',
    'activity.subtitle': 'Đóng góp & Thống kê',

    // Footer
    'footer.builtWith': 'Xây dựng với Next.js, Three.js & Framer Motion',

    // Project Details
    'project.be-lvtn.title': 'Quản lý Luận văn - Core Services',
    'project.be-lvtn.desc': '6 gRPC microservices (user, role, academic, thesis, council, file) với MySQL',
    'project.be_queue.title': 'Quản lý Luận văn - Job Queue',
    'project.be_queue.desc': 'Xử lý job bất đồng bộ với BullMQ cho plagiarism check, file generation, grade calculation',
    'project.plagiarism.title': 'Phát hiện Đạo văn bằng AI',
    'project.plagiarism.desc': 'OCR + Deep Learning, Elasticsearch full-text search, Vector Embeddings (bge-m3)',
    'project.fe_new.title': 'Quản lý Luận văn - Frontend',
    'project.fe_new.desc': 'Next.js frontend cho Sinh viên, Giảng viên, Phòng Đào tạo, Trưởng khoa',
    'project.fe_admin.title': 'Bảng điều khiển Admin & Workflow',
    'project.fe_admin.desc': 'Admin frontend cho Super Admins để cấu hình workflows và giám sát BullMQ jobs',
    'project.DAPM-BE.title': 'Hệ thống IoT Smart Home',
    'project.DAPM-BE.desc': 'GraphQL API cho smart home với real-time notifications, microservices, MQTT cho IoT',
    'project.BE_product_update.title': 'Nền tảng E-commerce',
    'project.BE_product_update.desc': 'Mua sắm online với real-time chat (WebSocket), OTP auth, admin dashboard',
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
