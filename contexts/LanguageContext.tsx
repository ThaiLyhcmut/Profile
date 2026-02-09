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
    'about.intro1': "I'm a <strong>4th-year Computer Science student</strong> at Ho Chi Minh City University of Technology (HCMUT), passionate about building scalable backend systems and cloud-native solutions.",
    'about.intro2': "Currently expanding expertise in <strong>distributed systems</strong>, <strong>microservices architecture</strong>, and <strong>high-performance computing</strong>. Experienced with gRPC, GraphQL, message queues (Kafka, BullMQ), and container orchestration.",
    'about.intro3': "I enjoy solving complex problems, optimizing performance, and designing robust architectures.",
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
    'experience.mangoads.desc1': 'Backend developer for enterprise banking & retail projects: VPBank Digital Banking Platform, ACB Online Banking System, TH True Milk E-commerce Platform',
    'experience.mangoads.desc2': 'Developing scalable backend services handling millions of transactions with high availability and security compliance',
    'experience.mangoads.desc3': 'Building reusable core framework for internal projects with Node.js, TypeScript, RESTful APIs',
    'experience.mangoads.desc4': 'Implementing performance optimization, caching strategies, and security best practices for financial applications',
    'experience.thesis.title': 'Thesis Management System',
    'experience.thesis.company': 'Graduation Project - HCMUT',
    'experience.thesis.location': 'Personal Project',
    'experience.thesis.period': '10/2025 - Present',
    'experience.thesis.desc1': 'Architecting microservices with 6 gRPC services (Golang), AI/ML service (Python), GraphQL Gateway',
    'experience.thesis.desc2': 'Implementing AI plagiarism detection with OCR, Elasticsearch, Vector Embeddings (bge-m3)',
    'experience.thesis.desc3': 'Building async job processing with Node.js/BullMQ for background tasks',

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
    'about.intro1': "Tôi là <strong>sinh viên năm 4 ngành Khoa học Máy tính</strong> tại Đại học Bách Khoa TP.HCM, đam mê xây dựng hệ thống backend có khả năng mở rộng và các giải pháp cloud-native.",
    'about.intro2': "Hiện đang mở rộng chuyên môn về <strong>hệ thống phân tán</strong>, <strong>kiến trúc microservices</strong>, và <strong>high-performance computing</strong>. Có kinh nghiệm với gRPC, GraphQL, message queues (Kafka, BullMQ), và container orchestration.",
    'about.intro3': "Tôi thích giải quyết các vấn đề phức tạp, tối ưu hiệu suất, và thiết kế kiến trúc vững chắc.",
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
    'experience.mangoads.desc1': 'Backend developer cho các dự án ngân hàng & bán lẻ doanh nghiệp: VPBank Digital Banking Platform, ACB Online Banking System, TH True Milk E-commerce Platform',
    'experience.mangoads.desc2': 'Phát triển backend services có khả năng mở rộng xử lý hàng triệu giao dịch với high availability và security compliance',
    'experience.mangoads.desc3': 'Xây dựng core framework có thể tái sử dụng cho các dự án nội bộ với Node.js, TypeScript, RESTful APIs',
    'experience.mangoads.desc4': 'Triển khai tối ưu hiệu suất, caching strategies, và security best practices cho ứng dụng tài chính',
    'experience.thesis.title': 'Hệ thống Quản lý Luận văn',
    'experience.thesis.company': 'Đồ án Tốt nghiệp - ĐHBK',
    'experience.thesis.location': 'Dự án Cá nhân',
    'experience.thesis.period': '10/2025 - Hiện tại',
    'experience.thesis.desc1': 'Thiết kế kiến trúc microservices với 6 gRPC services (Golang), AI/ML service (Python), GraphQL Gateway',
    'experience.thesis.desc2': 'Triển khai phát hiện đạo văn bằng AI với OCR, Elasticsearch, Vector Embeddings (bge-m3)',
    'experience.thesis.desc3': 'Xây dựng xử lý job bất đồng bộ với Node.js/BullMQ cho background tasks',

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
