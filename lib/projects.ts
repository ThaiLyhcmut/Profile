// Dữ liệu project dùng chung cho trang chính (card) và trang chi tiết (/projects/[slug]).
// Hỗ trợ song ngữ: field text có thể là string (dùng chung) hoặc { vi, en }.

/** Chuỗi song ngữ. Nếu là string -> dùng cho cả 2 ngôn ngữ. */
export type Loc = string | { vi: string; en: string }

export function tr(v: Loc | undefined, lang: string): string {
  if (v == null) return ""
  if (typeof v === "string") return v
  return lang === "en" ? v.en : v.vi
}

export interface ProjectLink {
  label: Loc
  url: string
}

export interface ProjectStat {
  value: string
  label: Loc
  /** Tên icon lucide (vd "Users", "Boxes", "Server", "Zap") */
  icon?: string
}

export interface ArchNode {
  label: string
  sub?: string
}

export interface ArchLayer {
  title: Loc
  nodes: ArchNode[]
}

export interface ModuleGroup {
  title: Loc
  /** Tên icon lucide (vd "Bot", "Mail", "Activity") */
  icon?: string
  items: string[]
}

export interface Project {
  slug: string
  title: string
  /** Icon lucide làm glyph lớn ở hero (vd "Bot", "Terminal") */
  icon?: string
  /** Mô tả 1 dòng hiển thị trên card trang chính */
  tagline: Loc
  /** Tech chính, hiển thị gọn trên card (chỉ vài cái đầu) */
  tech: string[]
  year?: string
  /** Repo private -> không show link ngoài */
  private?: boolean
  /** Nhãn quy mô: "Team (5)" | "Cá nhân" ... */
  team?: Loc
  /** Accent màu cho card/detail: tailwind color name (cyan, emerald, purple, orange...) */
  accent?: string

  // ----- Nội dung trang chi tiết -----
  overview: Loc
  features: Loc[]
  role?: Loc
  highlights?: Loc[]
  links?: ProjectLink[]
  /** Số liệu lớn hiển thị ở hero */
  stats?: ProjectStat[]
  /** Sơ đồ kiến trúc theo tầng (trên xuống) */
  architecture?: ArchLayer[]
  /** Lưới module/service nhóm theo domain */
  moduleGroups?: ModuleGroup[]
}

export const PROJECTS: Project[] = [
  {
    slug: "core-cms",
    title: "Core CMS — MongoREST Engine",
    icon: "Boxes",
    tagline: {
      vi: "CMS core headless: khai báo entity + cấp quyền là có ngay REST API động (filter + relation), không cần viết controller",
      en: "Headless CMS core: declare an entity + grant permissions and instantly get a dynamic REST API (filtering + relations), with zero controllers to write",
    },
    tech: ["Fastify", "TypeScript", "MongoDB", "MongoREST", "Redis", "BullMQ", "MinIO", "Swagger/OpenAPI", "Prometheus", "Loki", "Grafana"],
    year: "2025",
    private: true,
    accent: "blue",
    team: { vi: "Công ty · Team 5", en: "Company · Team 5" },
    overview: {
      vi: "Một CMS core dạng headless: thay vì viết controller cho từng API, bạn chỉ khai báo entity và cấp quyền — hệ thống tự sinh ra REST API động với filter và relation ngay lập tức, kèm tài liệu Swagger/OpenAPI tự động. Lấy ý tưởng từ PostgREST nhưng dựng cho MongoDB, mình xây 'MongoREST' — tầng dịch quyền-được-cấp thành câu query động (filter + relation đi theo đúng quyền của người gọi). Kiến trúc 3 lớp: common (lớp API chung) → intermediate (sinh câu lệnh MongoREST) → MongoDB. Schema được quản lý ngay dưới backend bằng MongoDB native và validate bằng AJV, toàn hệ thống mở rộng qua một hệ plugin lấy cảm hứng từ WordPress. Có pipeline xử lý ảnh nền (BullMQ + Sharp) tự sinh nhiều biến thể kích thước từ một ảnh gốc. Chạy trên Fastify (hiệu năng cao), Redis (cache), MinIO (lưu trữ file), giám sát bằng Prometheus + Loki + Grafana. Hiện đang vận hành trong hệ thống thật của VPBank, ACB, Dinh Group, Vệ tinh MangoAds, Inoue, Kewpie...",
      en: "A headless CMS core: instead of writing a controller per API, you just declare an entity and grant permissions — the system auto-generates a dynamic REST API with filtering and relations on the fly, with automatic Swagger/OpenAPI docs. Inspired by PostgREST but built for MongoDB, I created 'MongoREST' — a layer that translates granted permissions into dynamic queries (filters + relations follow exactly the caller's access). A three-layer architecture: common (shared API layer) → intermediate (MongoREST query generation) → MongoDB. Schemas are managed in the backend with MongoDB native and validated with AJV, and the whole system extends through a WordPress-inspired plugin system. A background image pipeline (BullMQ + Sharp) auto-generates multiple sized variants from a single source image. It runs on Fastify (high performance), Redis (cache), MinIO (file storage), monitored with Prometheus + Loki + Grafana. It currently powers production systems for VPBank, ACB, Dinh Group, MangoAds satellites, Inoue, Kewpie...",
    },
    features: [
      { vi: "Khai báo entity + cấp quyền là có ngay REST API — không cần viết controller cho từng route", en: "Declare an entity + grant permissions to get a REST API instantly — no per-route controllers" },
      { vi: "MongoREST: filter động + relation động, sinh tự động theo quyền được cấp (ý tưởng từ PostgREST)", en: "MongoREST: dynamic filtering + dynamic relations, auto-generated from granted permissions (PostgREST-inspired)" },
      { vi: "Kiến trúc 3 lớp: common → intermediate (query MongoREST) → MongoDB", en: "Three-layer architecture: common → intermediate (MongoREST query) → MongoDB" },
      { vi: "Hệ thống plugin lấy ý tưởng từ WordPress — cắm thêm tính năng mà không đụng vào core", en: "WordPress-inspired plugin system — add features without touching the core" },
      { vi: "Quản lý schema dưới backend bằng MongoDB native, validate dữ liệu bằng AJV (JSON Schema)", en: "Schema managed in the backend with MongoDB native, data validated with AJV (JSON Schema)" },
      { vi: "Tài liệu API tự động bằng Swagger/OpenAPI; auth JWT + Passport, bcrypt", en: "Automatic API docs via Swagger/OpenAPI; JWT + Passport auth, bcrypt" },
      { vi: "Pipeline xử lý ảnh nền (BullMQ + Sharp): từ 1 ảnh gốc sinh ra nhiều biến thể kích thước khác nhau", en: "Background image pipeline (BullMQ + Sharp): generate multiple sized variants from one source image" },
      { vi: "Phân quyền chi tiết: relation và dữ liệu trả về bám đúng theo quyền của người gọi", en: "Fine-grained permissions: relations and returned data follow the caller's granted access" },
      { vi: "Hạ tầng sản xuất: Fastify hiệu năng cao, Redis cache, MinIO lưu trữ file", en: "Production infra: high-performance Fastify, Redis cache, MinIO file storage" },
      { vi: "Observability đầy đủ: metrics Prometheus, log Pino → Loki + Grafana", en: "Full observability: Prometheus metrics, Pino logs → Loki + Grafana" },
    ],
    role: {
      vi: "Dev phần core + hệ thống plugin (phần linh hồn của hệ thống) — trong team 5 người",
      en: "Core + plugin-system developer (the heart of the system) — in a 5-person team",
    },
    highlights: [
      { vi: "Đang vận hành trong hệ thống thật của VPBank, ACB, Dinh Group, Vệ tinh MangoAds, Inoue, Kewpie...", en: "Running in production for VPBank, ACB, Dinh Group, MangoAds satellites, Inoue, Kewpie..." },
      { vi: "Tự sinh API từ entity + quyền — cắt giảm cực mạnh thời gian dựng backend", en: "Auto-generates APIs from entity + permissions — drastically cuts backend build time" },
      { vi: "MongoREST: mang trải nghiệm PostgREST sang thế giới MongoDB", en: "MongoREST: brings the PostgREST experience to the MongoDB world" },
      { vi: "Hệ plugin kiểu WordPress giúp mở rộng gần như vô hạn mà không sửa core", en: "WordPress-style plugins enable near-limitless extension without modifying the core" },
      { vi: "Mình phụ trách phần linh hồn: core engine + plugin system", en: "I own the soul of the system: the core engine + plugin system" },
    ],
    links: [],
    stats: [
      { value: "6+", label: { vi: "Doanh nghiệp dùng", en: "Enterprises using it" }, icon: "Building2" },
      { value: "0", label: { vi: "Controller phải viết", en: "Controllers to write" }, icon: "Zap" },
      { value: "3", label: { vi: "Tầng kiến trúc", en: "Architecture layers" }, icon: "Layers" },
      { value: "5", label: { vi: "Thành viên team", en: "Team members" }, icon: "Users" },
    ],
    architecture: [
      { title: { vi: "Common (lớp API)", en: "Common (API layer)" }, nodes: [{ label: "REST endpoints", sub: "Swagger/OpenAPI" }, { label: "Auth & Permissions", sub: "JWT + Passport" }, { label: "Plugin hooks" }] },
      { title: "Intermediate (MongoREST)", nodes: [{ label: "Query builder", sub: "filter + relation" }, { label: "Permission resolver" }, { label: "AJV", sub: "validation" }] },
      { title: "MongoDB", nodes: [{ label: "Collections" }, { label: "Schema (native)" }] },
      { title: { vi: "Worker & Hạ tầng", en: "Worker & Infra" }, nodes: [{ label: "BullMQ" }, { label: "Image pipeline", sub: "Sharp" }, { label: "Fastify" }, { label: "Redis", sub: "cache" }, { label: "MinIO", sub: "storage" }] },
      { title: { vi: "Observability", en: "Observability" }, nodes: [{ label: "Prometheus" }, { label: "Pino" }, { label: "Loki" }, { label: "Grafana" }] },
    ],
    moduleGroups: [
      { title: { vi: "Entity & API", en: "Entity & API" }, icon: "Boxes", items: ["Entity declaration", "Auto REST API", "Swagger/OpenAPI", "Dynamic filter", "Dynamic relation"] },
      { title: "MongoREST", icon: "GitBranch", items: ["Query builder", "Permission resolver", "PostgREST-style", "Aggregation"] },
      { title: { vi: "Phân quyền & Validate", en: "Permissions & Validation" }, icon: "ShieldCheck", items: ["Grant per entity", "RLS-like", "Relation scoping", "AJV / JSON Schema"] },
      { title: { vi: "Plugin System", en: "Plugin System" }, icon: "Puzzle", items: ["WordPress-style", "Hooks", "Extend without core change"] },
      { title: { vi: "Worker & Ảnh", en: "Worker & Images" }, icon: "Image", items: ["BullMQ jobs", "Sharp resize", "Multi-size variants", "node-cron"] },
      { title: { vi: "Hạ tầng & Observability", en: "Infra & Observability" }, icon: "Server", items: ["Fastify", "Redis", "MinIO", "Prometheus", "Loki", "Grafana"] },
    ],
  },
  {
    slug: "grpc-gen",
    title: "grpc-gen",
    icon: "Terminal",
    tagline: {
      vi: "Sinh full-stack gRPC + GraphQL gateway + business-rule engine từ file .proto chỉ với 3 lệnh",
      en: "Scaffold a full-stack gRPC + GraphQL gateway + business-rule engine from .proto files in 3 commands",
    },
    tech: ["Go", "gRPC", "Protobuf", "gqlgen", "GraphQL", "MongoDB", "MySQL", "Redis", "Docker"],
    year: "11/2025",
    accent: "cyan",
    team: { vi: "Cá nhân", en: "Personal" },
    overview: {
      vi: "Code generator viết bằng Go, lấy ý tưởng từ gqlgen, Hasura và PostgREST: bạn chỉ viết file .proto, công cụ sinh ra nguyên một production stack — các gRPC service, một GraphQL gateway đứng trước, và một business engine chạy bằng MongoDB cho validation, row-level security và compute action nhiều bước; tất cả được nối sẵn TLS, structured logging, DataLoaders và Dockerfile. Engine là data-driven (rule/scope/action là Mongo document, hot-reload không cần rebuild). Code sinh ra là Go readable commit thẳng vào repo, không phụ thuộc runtime vào tool. Đã production-tested trên 2 hệ thật (một LMS và một hệ quản lý luận văn) với ~700 integration test mỗi hệ.",
      en: "A code generator written in Go, inspired by gqlgen, Hasura and PostgREST: you write .proto files and the tool emits an entire production stack — gRPC services, a GraphQL gateway in front of them, and a MongoDB-backed business engine for validation, row-level security and multi-step compute actions; all wired with TLS, structured logging, DataLoaders and Dockerfiles. The engine is data-driven (rules/scopes/actions are Mongo documents, hot-reloaded without a rebuild). The emitted code is readable Go you commit to your repo, with no runtime dependency on the tool. Production-tested against two real apps (an LMS and a thesis-management system) with ~700 integration tests each.",
    },
    features: [
      { vi: "3 lệnh dựng cả hệ: init → add-service → add-gateway", en: "3 commands to scaffold the whole system: init → add-service → add-gateway" },
      { vi: "Sinh gRPC CRUD service: MySQL pool, filter whitelist, pagination, Dockerfile", en: "Generates gRPC CRUD services: MySQL pool, filter whitelist, pagination, Dockerfile" },
      { vi: "GraphQL gateway bằng gqlgen: schema + resolvers + DataLoaders (Redis 2-layer cache) + directive @auth", en: "GraphQL gateway via gqlgen: schema + resolvers + DataLoaders (Redis 2-layer cache) + @auth directive" },
      { vi: "Business engine data-driven trên MongoDB: business_rule (validation), read_scope (RLS), action (pipeline sau mutation) — hot-reload", en: "Data-driven business engine on MongoDB: business_rule (validation), read_scope (RLS), action (post-mutation pipeline) — hot-reload" },
      { vi: "Admin REST API CRUD runtime cho rules / policies / scopes / actions", en: "Runtime Admin REST API to CRUD rules / policies / scopes / actions" },
      { vi: "mTLS giữa gateway ↔ service, function tracer + structured logging", en: "mTLS between gateway ↔ services, function tracer + structured logging" },
      { vi: "Code sinh ra là Go readable, commit vào repo, không phụ thuộc runtime vào tool", en: "Emits readable Go committed to your repo, with no runtime dependency on the tool" },
      { vi: "Binary cross-platform: linux / macOS / windows × amd64 / arm64", en: "Cross-platform binaries: linux / macOS / windows × amd64 / arm64" },
    ],
    role: {
      vi: "Tác giả & maintainer — thiết kế CLI, code generator và business engine",
      en: "Author & maintainer — designed the CLI, code generator and business engine",
    },
    highlights: [
      { vi: "Lấy ý tưởng từ gqlgen, Hasura & PostgREST — sinh code Go readable, không phải framework runtime", en: "Inspired by gqlgen, Hasura & PostgREST — generates readable Go, not a runtime framework" },
      { vi: "Production-tested trên 2 ứng dụng thật, ~700 integration test mỗi app", en: "Production-tested on two real apps, ~700 integration tests each" },
      { vi: "Engine data-driven: sửa rule/RLS/action bằng Mongo document + reload, khỏi rebuild", en: "Data-driven engine: edit rules/RLS/actions as Mongo docs + reload, no rebuild" },
      { vi: "Kiến trúc 3 tầng tách bạch: Services / Gateway / Engine, deploy độc lập", en: "Three cleanly separated layers: Services / Gateway / Engine, deployed independently" },
    ],
    links: [
      { label: "GitHub", url: "https://github.com/thailymmo/grpc-gen" },
      { label: "pkg.go.dev", url: "https://pkg.go.dev/github.com/thailymmo/grpc-gen" },
    ],
    stats: [
      { value: "3", label: { vi: "Lệnh → full-stack", en: "Commands → full-stack" }, icon: "Terminal" },
      { value: "3", label: { vi: "Tầng kiến trúc", en: "Architecture layers" }, icon: "Layers" },
      { value: "700+", label: { vi: "Integration tests", en: "Integration tests" }, icon: "Activity" },
      { value: "MIT", label: { vi: "Mã nguồn mở", en: "Open source" }, icon: "GitBranch" },
    ],
    architecture: [
      { title: "Client", nodes: [{ label: "Web / Mobile", sub: "GraphQL over HTTP" }] },
      { title: "Gateway", nodes: [{ label: "gqlgen", sub: "schema + resolvers" }, { label: "DataLoaders", sub: "Redis cache" }, { label: "@auth", sub: "MongoEnforcer" }, { label: "Admin REST", sub: "runtime CRUD" }] },
      { title: "Business Engine", nodes: [{ label: "business_rule", sub: "validation" }, { label: "read_scope", sub: "RLS" }, { label: "action", sub: "pipeline" }] },
      { title: "Services (gRPC / mTLS)", nodes: [{ label: "CRUD Handlers", sub: "MySQL" }, { label: "Filter whitelist" }, { label: "Tracer + logger" }] },
      { title: "Storage", nodes: [{ label: "MySQL" }, { label: "MongoDB", sub: "engine state" }, { label: "Redis" }, { label: "MinIO", sub: "file uploads" }] },
    ],
    moduleGroups: [
      { title: "CLI", icon: "Terminal", items: ["init", "add-service", "add-gateway", "proto gen"] },
      { title: "Services", icon: "Server", items: ["gRPC CRUD", "MySQL pool", "Filter whitelist", "Pagination", "Dockerfile"] },
      { title: "Gateway (gqlgen)", icon: "GitBranch", items: ["GraphQL schema", "Resolvers", "DataLoaders", "@auth directive", "Admin REST"] },
      { title: "Business Engine", icon: "Boxes", items: ["business_rule", "read_scope (RLS)", "action pipeline", "Hot-reload"] },
      { title: "Infra", icon: "Database", items: ["MySQL", "MongoDB", "Redis", "MinIO", "mTLS"] },
      { title: "Developer UX", icon: "Cpu", items: ["Readable Go", "No runtime dep", "Structured logging", "Cross-platform binary"] },
    ],
  },
  {
    slug: "lvtn-thesis",
    title: "LVTN — Thesis Management System",
    icon: "GraduationCap",
    tagline: {
      vi: "Hệ quản lý luận văn tốt nghiệp đại học — 5 gRPC service + GraphQL gateway, ~80% sinh tự động từ grpc-gen",
      en: "A university thesis-management system — 5 gRPC services + GraphQL gateway, ~80% auto-generated by grpc-gen",
    },
    tech: ["Go", "gRPC", "GraphQL", "gqlgen", "MongoDB", "MySQL", "Redis", "MinIO", "Docker", "mTLS"],
    year: "2026",
    private: true,
    accent: "pink",
    team: { vi: "Team (2)", en: "Team (2)" },
    overview: {
      vi: "Hệ thống backend microservice quản lý đồ án/luận văn tốt nghiệp tại trường đại học, được sinh ra từ grpc-gen: khoảng 80% code (CRUD service, GraphQL gateway, business engine) là tự động, phần còn lại là business logic và một vài service phải tự code tay (grpc-gen chỉ là công cụ code nhanh, lấy ý tưởng từ Hasura/PostgREST). Gồm 5 gRPC service (user, academic, thesis, council, file) + 1 GraphQL gateway, business engine data-driven trên MongoDB (rule/RLS/action hot-reload), phân quyền đa tầng (operation + field + row-level), role hierarchy đổi theo từng học kỳ, auth Google OAuth + JWT, upload MinIO, mTLS giữa các service, và CI/CD tự build 6 Docker image.",
      en: "A microservice backend for managing university graduation theses, generated from grpc-gen: about 80% of the code (CRUD services, GraphQL gateway, business engine) is auto-generated, the rest being business logic and a few hand-coded services (grpc-gen is just a fast-coding tool, inspired by Hasura/PostgREST). It has 5 gRPC services (user, academic, thesis, council, file) + 1 GraphQL gateway, a data-driven business engine on MongoDB (rule/RLS/action hot-reload), multi-layer authorization (operation + field + row-level), a role hierarchy that changes per semester, Google OAuth + JWT auth, MinIO upload, mTLS between services, and CI/CD that auto-builds 6 Docker images.",
    },
    features: [
      { vi: "5 gRPC microservice (user, academic, thesis, council, file) + 1 GraphQL gateway", en: "5 gRPC microservices (user, academic, thesis, council, file) + 1 GraphQL gateway" },
      { vi: "~80% sinh tự động bằng grpc-gen, phần còn lại là business logic + vài service code tay", en: "~80% auto-generated by grpc-gen, the rest is business logic + a few hand-coded services" },
      { vi: "Business engine data-driven trên MongoDB: rule / RLS / action, hot-reload không redeploy", en: "Data-driven business engine on MongoDB: rule / RLS / action, hot-reload without redeploy" },
      { vi: "Phân quyền đa tầng: operation-level (op_auth) + field-level (field_auth) + row-level (read_scope)", en: "Multi-layer authorization: operation-level (op_auth) + field-level (field_auth) + row-level (read_scope)" },
      { vi: "Role hierarchy + per-semester: ADMIN > DEPT_LECTURER > TEACHER > STUDENT, đổi theo kỳ học", en: "Role hierarchy + per-semester: ADMIN > DEPT_LECTURER > TEACHER > STUDENT, changing each semester" },
      { vi: "Auth Google OAuth (production) + dev fallback, JWT HS256; GraphQL gateway có DataLoader chống N+1 + Redis 2-layer cache", en: "Google OAuth (production) + dev fallback, JWT HS256; GraphQL gateway with N+1-proof DataLoader + Redis 2-layer cache" },
      { vi: "mTLS giữa gateway ↔ service, upload file qua MinIO", en: "mTLS between gateway ↔ services, file upload via MinIO" },
      { vi: "CI/CD GitHub Actions: build 6 Docker image (matrix) → Docker Hub → Watchtower deploy", en: "CI/CD GitHub Actions: build 6 Docker images (matrix) → Docker Hub → Watchtower deploy" },
    ],
    role: {
      vi: "DEV trong team 2 người (BA + DEV) — dựng hệ qua grpc-gen, viết business logic và các service cần code tay",
      en: "DEV in a 2-person team (BA + DEV) — built the system with grpc-gen, wrote the business logic and hand-coded services",
    },
    highlights: [
      { vi: "~80% code sinh tự động từ grpc-gen — dựng cả hệ microservice trong thời gian ngắn", en: "~80% auto-generated by grpc-gen — a whole microservice system stood up quickly" },
      { vi: "Là 1 trong 2 ứng dụng thật dùng để production-test grpc-gen (~700 integration test)", en: "One of the two real apps used to production-test grpc-gen (~700 integration tests)" },
      { vi: "Phân quyền 3 tầng + role đổi theo học kỳ — sát mô hình thực tế của trường đại học", en: "Three-layer authorization + per-semester roles — close to a real university model" },
      { vi: "Business engine sửa rule bằng Mongo document, không cần redeploy", en: "Business engine: edit rules as Mongo documents, no redeploy needed" },
    ],
    links: [],
    stats: [
      { value: "5", label: { vi: "gRPC service", en: "gRPC services" }, icon: "Server" },
      { value: "~80%", label: { vi: "Code sinh tự động", en: "Auto-generated" }, icon: "Zap" },
      { value: "3", label: { vi: "Tầng phân quyền", en: "Authz layers" }, icon: "Lock" },
      { value: "6", label: { vi: "Docker image CI/CD", en: "CI/CD Docker images" }, icon: "Boxes" },
    ],
    architecture: [
      { title: "Client", nodes: [{ label: "Web / Mobile", sub: "GraphQL + REST + WS" }] },
      { title: "Gateway :8081", nodes: [{ label: "gqlgen", sub: "GraphQL" }, { label: "Business Engine", sub: "Mongo hot-reload" }, { label: "JWT + OAuth" }, { label: "Admin REST" }] },
      { title: { vi: "5 gRPC service (mTLS)", en: "5 gRPC services (mTLS)" }, nodes: [{ label: "user" }, { label: "academic" }, { label: "thesis" }, { label: "council" }, { label: "file" }] },
      { title: "Storage", nodes: [{ label: "MySQL" }, { label: "MongoDB", sub: "engine" }, { label: "Redis" }, { label: "MinIO" }] },
    ],
    moduleGroups: [
      { title: "Microservices", icon: "Server", items: ["user", "academic", "thesis", "council", "file"] },
      { title: "Gateway", icon: "GitBranch", items: ["GraphQL (gqlgen)", "DataLoader", "Redis 2-layer cache", "Admin REST"] },
      { title: { vi: "Phân quyền", en: "Authorization" }, icon: "Lock", items: ["op_auth", "field_auth", "read_scope (RLS)", "Role hierarchy", "Per-semester"] },
      { title: { vi: "Business Engine", en: "Business Engine" }, icon: "Boxes", items: ["business_rule", "action", "Hot-reload", "Mongo-backed"] },
      { title: { vi: "Auth & Files", en: "Auth & Files" }, icon: "ShieldCheck", items: ["Google OAuth", "JWT HS256", "MinIO upload", "mTLS"] },
      { title: "CI/CD", icon: "Cpu", items: ["GitHub Actions", "6 Docker images", "Docker Hub", "Watchtower"] },
    ],
  },
  {
    slug: "tk-platform",
    title: "TK — Telegram Automation Platform",
    icon: "Bot",
    tagline: {
      vi: "Nền tảng SaaS quản lý hàng loạt bot & tài khoản Telegram, đang phục vụ 100k+ thành viên",
      en: "A SaaS platform to manage Telegram bots & accounts at scale, currently serving 100k+ members",
    },
    tech: ["Python", "FastAPI", "MongoDB", "Redis", "Telethon", "Next.js", "Web3", "Cloudflare Workers", "Grafana"],
    year: "10/2025",
    private: true,
    accent: "emerald",
    team: { vi: "Cá nhân", en: "Personal" },
    overview: {
      vi: "Hệ thống lớn dạng SaaS giúp quản lý tập trung nhiều bot và nhiều tài khoản Telegram cùng lúc. Backend trung tâm (FastAPI + MongoDB + Redis + AWS S3) điều phối rule engine, broadcast, thông báo, xử lý media/video và đo lường usage; các agent self-host (bot, userbot, Cloudflare Worker) chạy ở bất kỳ VPS nào và đồng bộ realtime với backend qua WebSocket. Hệ thống hiện đang hỗ trợ hơn 100.000 thành viên trên Telegram.",
      en: "A large SaaS system for centrally managing many Telegram bots and accounts at once. A central backend (FastAPI + MongoDB + Redis + AWS S3) orchestrates the rule engine, broadcast, notifications, media/video processing and usage metering; self-hosted agents (bot, userbot, Cloudflare Worker) run on any VPS and sync in realtime with the backend over WebSocket. The system currently supports more than 100,000 members on Telegram.",
    },
    features: [
      { vi: "Quản lý nhiều bot Telegram và nhiều tài khoản user (Telethon) từ một dashboard tập trung", en: "Manage many Telegram bots and user accounts (Telethon) from one central dashboard" },
      { vi: "Rule engine: forward rules, reply rules, AI rules — đồng bộ realtime tới agent qua WebSocket, fallback HTTP khi mất kết nối", en: "Rule engine: forward rules, reply rules, AI rules — synced in realtime to agents via WebSocket, HTTP fallback on disconnect" },
      { vi: "Agent self-host: chạy bot/userbot ở bất kỳ đâu, multi-bot trong 1 process để tiết kiệm RAM, auto-reconnect + heartbeat", en: "Self-hosted agents: run bots/userbots anywhere, multi-bot in one process to save RAM, auto-reconnect + heartbeat" },
      { vi: "Email routing qua Cloudflare Email Routing + Cloudflare Worker để nhận và xử lý email", en: "Email routing via Cloudflare Email Routing + Cloudflare Worker to receive and process email" },
      { vi: "Broadcast / gửi tin hàng loạt cùng hệ thống thông báo (notifications + push)", en: "Broadcast / mass messaging plus a notification system (notifications + push)" },
      { vi: "Cắt & xử lý video, quản lý media với AWS S3 và file cache", en: "Video cutting & processing, media managed with AWS S3 and file cache" },
      { vi: "Billing trên blockchain: thanh toán bằng crypto qua connect wallet (Web3), subscription & giới hạn theo plan, đo lường usage qua service-auth API", en: "On-chain billing: crypto payments via connect wallet (Web3), subscriptions & plan limits, usage metering via the service-auth API" },
      { vi: "Monitoring & observability với Loki + Grafana, agent logs, reports và dashboard realtime", en: "Monitoring & observability with Loki + Grafana, agent logs, reports and a realtime dashboard" },
    ],
    role: {
      vi: "Tác giả & maintainer — thiết kế kiến trúc, backend trung tâm, agent self-host và dashboard",
      en: "Author & maintainer — designed the architecture, central backend, self-host agents and dashboard",
    },
    highlights: [
      { vi: "Đang phục vụ 100k+ thành viên trên Telegram", en: "Currently serving 100k+ members on Telegram" },
      { vi: "Kiến trúc phân tán: backend trung tâm + agent self-host đồng bộ realtime qua WebSocket", en: "Distributed architecture: central backend + self-host agents synced in realtime over WebSocket" },
      { vi: "Service-auth tập trung enforce plan limit / usage cho mọi microservice, cache Redis 5 phút", en: "Central service-auth enforces plan limits / usage for every microservice, Redis cache 5 min" },
      { vi: "Self-host agent đóng gói Docker, multi-bot trong 1 process, fallback HTTP khi mất WS", en: "Self-host agents packaged with Docker, multi-bot per process, HTTP fallback on WS loss" },
      { vi: "Billing phi tập trung trên blockchain — thanh toán crypto qua connect wallet (Web3)", en: "Decentralized on-chain billing — crypto payments via connect wallet (Web3)" },
    ],
    links: [{ label: { vi: "Truy cập hệ thống", en: "Open the app" }, url: "https://tgbot.thaily.tech" }],
    stats: [
      { value: "100K+", label: { vi: "Thành viên Telegram", en: "Telegram members" }, icon: "Users" },
      { value: "28+", label: { vi: "API modules", en: "API modules" }, icon: "Boxes" },
      { value: "5", label: { vi: "Service / Agent", en: "Service / Agent" }, icon: "Server" },
      { value: "24/7", label: { vi: "Realtime sync", en: "Realtime sync" }, icon: "Zap" },
    ],
    architecture: [
      { title: { vi: "Giao diện", en: "Interface" }, nodes: [{ label: "Dashboard", sub: "Next.js" }, { label: "Telegram", sub: "100k+ members" }] },
      { title: { vi: "Backend trung tâm", en: "Central Backend" }, nodes: [{ label: "FastAPI", sub: "28+ modules" }, { label: "WebSocket", sub: "realtime sync" }] },
      { title: { vi: "Hạ tầng dữ liệu", en: "Data Infrastructure" }, nodes: [{ label: "MongoDB" }, { label: "Redis" }, { label: "AWS S3" }] },
      { title: { vi: "Agent phân tán (self-host)", en: "Distributed Agents (self-host)" }, nodes: [{ label: "Bot Agent" }, { label: "Userbot Agent", sub: "Telethon" }, { label: "Video Service" }, { label: "Cloudflare Worker", sub: "email" }] },
      { title: "Observability", nodes: [{ label: "Loki" }, { label: "Grafana" }, { label: "Reports" }] },
    ],
    moduleGroups: [
      { title: { vi: "Bot & Tài khoản", en: "Bots & Accounts" }, icon: "Bot", items: ["Bots", "Bot Agent", "User Accounts", "Userbot Agent"] },
      { title: "Rule Engine", icon: "GitBranch", items: ["Forward Rules", "Reply Rules", "AI Rules"] },
      { title: "Messaging", icon: "MessageSquare", items: ["Broadcasts", "Conversations", "Chats", "Notifications", "Push"] },
      { title: "Email & Media", icon: "Mail", items: ["Email Routing", "Media", "File Cache", "Video Tools"] },
      { title: "Billing (Blockchain)", icon: "Wallet", items: ["Subscriptions", "Crypto Payments", "Connect Wallet", "Service Auth", "Settings"] },
      { title: "Observability", icon: "Activity", items: ["Logs", "Agent Logs", "Reports", "Dashboard"] },
    ],
  },
  {
    slug: "tiktok-video-gen",
    title: "AI TikTok Video Generator",
    icon: "Video",
    tagline: {
      vi: "Hệ thống AI sản xuất video TikTok end-to-end: nghiên cứu → kịch bản → giọng đọc → render → tự đăng",
      en: "An AI system producing TikTok videos end-to-end: research → script → voiceover → render → auto-publish",
    },
    tech: ["Python", "FastAPI", "Claude Agent SDK", "9router", "Remotion", "edge-TTS", "Playwright", "n8n", "Electron"],
    year: "2026",
    private: true,
    accent: "purple",
    team: { vi: "Cá nhân", en: "Personal" },
    overview: {
      vi: "Một hệ thống AI sản xuất video TikTok hoàn toàn tự động theo pipeline khép kín. Một AI agent (xây trên Claude Agent SDK) tự nghiên cứu web (google_search + web_fetch), viết kịch bản voiceover tiếng Việt và chọn ảnh thật từ nguồn uy tín; toàn bộ lời gọi model đi qua '9router' — một AI gateway/proxy định tuyến tới nhiều model (gemini-pro-agent, search-combo...). Sau đó edge-TTS sinh giọng đọc, Remotion render video (ảnh + giọng + phụ đề theo template), rồi Playwright tự động đăng lên TikTok (tự giải captcha, quản lý cookie) kèm đặt lịch và hashtag. Toàn bộ được điều phối bằng n8n và điều khiển qua một app desktop (Electron); backend chạy FastAPI.",
      en: "A fully automated AI system that produces TikTok videos through a closed-loop pipeline. An AI agent (built on the Claude Agent SDK) researches the web itself (google_search + web_fetch), writes a Vietnamese voiceover script and picks real images from reputable sources; all model calls go through '9router' — an AI gateway/proxy that routes to multiple models (gemini-pro-agent, search-combo...). Then edge-TTS generates the voiceover, Remotion renders the video (images + voice + captions from templates), and Playwright auto-publishes to TikTok (solving captchas, managing cookies) with scheduling and hashtags. Everything is orchestrated with n8n and driven from an Electron desktop app; the backend runs on FastAPI.",
    },
    features: [
      { vi: "AI agent (Claude Agent SDK) tự nghiên cứu web, viết kịch bản voiceover tiếng Việt và chọn ảnh thật (không bịa URL)", en: "AI agent (Claude Agent SDK) researches the web, writes a Vietnamese voiceover script and picks real images (no fabricated URLs)" },
      { vi: "Tích hợp 9router — AI gateway/proxy định tuyến tới nhiều model (gemini-pro-agent, search-combo)", en: "Integrates 9router — an AI gateway/proxy routing to multiple models (gemini-pro-agent, search-combo)" },
      { vi: "Sinh giọng đọc tự động bằng edge-TTS", en: "Automatic voiceover with edge-TTS" },
      { vi: "Render video bằng Remotion: ghép ảnh + giọng + phụ đề theo template", en: "Video rendering with Remotion: images + voice + captions from templates" },
      { vi: "Tự động đăng TikTok bằng Playwright: giải captcha, quản lý cookie, đa tài khoản", en: "Auto-publish to TikTok with Playwright: captcha solving, cookie management, multi-account" },
      { vi: "Đặt lịch đăng + tự sinh hashtag; pipeline tin tức: lấy nhiều tin → dựng hàng loạt video", en: "Scheduled posting + auto hashtags; news pipeline: many news items → batch videos" },
      { vi: "Điều phối bằng n8n workflow, điều khiển qua app desktop Electron", en: "Orchestrated with an n8n workflow, controlled via an Electron desktop app" },
      { vi: "Backend FastAPI (uvicorn, jinja2, httpx, Pillow)", en: "FastAPI backend (uvicorn, jinja2, httpx, Pillow)" },
    ],
    role: {
      vi: "Tác giả — thiết kế pipeline AI, tích hợp 9router, render Remotion và auto-upload TikTok",
      en: "Author — designed the AI pipeline, 9router integration, Remotion rendering and TikTok auto-upload",
    },
    highlights: [
      { vi: "Pipeline khép kín: từ chủ đề → video đăng TikTok, không cần thao tác tay", en: "Closed-loop pipeline: from a topic → a published TikTok video, no manual steps" },
      { vi: "AI agent tự nghiên cứu web + chọn ảnh thật, chống bịa thông tin/URL", en: "AI agent self-researches the web + picks real images, avoiding fabricated info/URLs" },
      { vi: "9router: một cổng AI định tuyến nhiều model linh hoạt", en: "9router: a single AI gateway flexibly routing many models" },
      { vi: "Tự giải captcha + quản lý cookie để đăng TikTok ổn định ở quy mô", en: "Captcha solving + cookie management for stable TikTok posting at scale" },
    ],
    links: [],
    stats: [
      { value: "E2E", label: { vi: "Pipeline tự động", en: "Automated pipeline" }, icon: "Zap" },
      { value: "9router", label: { vi: "AI gateway", en: "AI gateway" }, icon: "Radio" },
      { value: "5", label: { vi: "Bước trong pipeline", en: "Pipeline stages" }, icon: "Layers" },
      { value: "24/7", label: { vi: "Đăng theo lịch", en: "Scheduled posting" }, icon: "Send" },
    ],
    architecture: [
      { title: { vi: "Đầu vào", en: "Input" }, nodes: [{ label: "Topic / News", sub: "news pipeline" }, { label: "Desktop App", sub: "Electron" }] },
      { title: "AI Agent (9router)", nodes: [{ label: "Claude Agent SDK" }, { label: "9router", sub: "model gateway" }, { label: "Web research", sub: "search + fetch" }] },
      { title: { vi: "Sản xuất", en: "Production" }, nodes: [{ label: "edge-TTS", sub: "voiceover" }, { label: "Remotion", sub: "render video" }] },
      { title: { vi: "Đăng tải", en: "Publishing" }, nodes: [{ label: "Playwright", sub: "auto-upload" }, { label: "Captcha solver" }, { label: "Scheduler", sub: "+ hashtags" }] },
      { title: { vi: "Điều phối & Hạ tầng", en: "Orchestration & Infra" }, nodes: [{ label: "n8n", sub: "workflow" }, { label: "FastAPI" }] },
    ],
    moduleGroups: [
      { title: { vi: "AI & Script", en: "AI & Script" }, icon: "Bot", items: ["Claude Agent SDK", "9router gateway", "Web research", "Script tiếng Việt"] },
      { title: "Media", icon: "Video", items: ["edge-TTS voiceover", "Remotion render", "Image fetch", "Templates"] },
      { title: { vi: "Tự đăng TikTok", en: "TikTok Auto-Post" }, icon: "Send", items: ["Playwright upload", "Captcha solver", "Cookie manager", "Schedule + hashtag"] },
      { title: { vi: "Điều phối", en: "Orchestration" }, icon: "GitBranch", items: ["n8n workflow", "Electron app", "News pipeline"] },
      { title: "Backend", icon: "Server", items: ["FastAPI", "Jinja2", "httpx", "Pillow"] },
    ],
  },
  {
    slug: "tools",
    title: "Other Tools — Automation Toolkit",
    icon: "Puzzle",
    tagline: {
      vi: "Bộ công cụ hỗ trợ: tiện ích Telegram, kiểm tra & xác minh Instagram, sinh giọng nói AI...",
      en: "A toolkit of supporting utilities: Telegram helpers, Instagram check & verify, AI voice generation...",
    },
    tech: ["Go", "Python", "Node.js", "ElevenLabs", "Telegram", "Instagram"],
    year: "2026",
    private: true,
    accent: "orange",
    team: { vi: "Cá nhân", en: "Personal" },
    overview: {
      vi: "Tập hợp các công cụ nhỏ mình tự viết để hỗ trợ vận hành và tự động hoá hằng ngày, phục vụ cho các hệ thống lớn hơn. Bao gồm tiện ích cho Telegram (tk_note...), công cụ kiểm tra Instagram (ins_check_go), xác minh ảnh/video Instagram (ins_verify_image_video_go), và dịch vụ sinh giọng nói AI với ElevenLabs (voice_elevenLABS). Mỗi tool nhỏ gọn, viết bằng Go / Python / Node.js tuỳ bài toán.",
      en: "A collection of small tools I built to support daily operations and automation, serving the larger systems. It includes Telegram utilities (tk_note...), an Instagram checker (ins_check_go), Instagram image/video verification (ins_verify_image_video_go), and an AI voice generation service with ElevenLabs (voice_elevenLABS). Each tool is small and focused, written in Go / Python / Node.js depending on the task.",
    },
    features: [
      { vi: "tk_note — tiện ích ghi chú / quản lý trên Telegram", en: "tk_note — note / management utility on Telegram" },
      { vi: "ins_check_go — kiểm tra tài khoản / nội dung Instagram (Go)", en: "ins_check_go — Instagram account / content checker (Go)" },
      { vi: "ins_verify_image_video_go — xác minh tính hợp lệ ảnh/video Instagram (Go)", en: "ins_verify_image_video_go — verifies Instagram image/video validity (Go)" },
      { vi: "voice_elevenLABS — sinh giọng nói tự nhiên qua ElevenLabs", en: "voice_elevenLABS — natural voice generation via ElevenLabs" },
      { vi: "Nhiều tiện ích Telegram khác phục vụ tự động hoá", en: "Various other Telegram utilities for automation" },
    ],
    role: {
      vi: "Tác giả — tự viết các công cụ phục vụ vận hành & tự động hoá",
      en: "Author — built these tools to support operations & automation",
    },
    highlights: [
      { vi: "Bộ công cụ đa nền tảng: Telegram, Instagram, AI voice", en: "Multi-platform toolkit: Telegram, Instagram, AI voice" },
      { vi: "Viết bằng Go, Python, Node.js tuỳ bài toán", en: "Written in Go, Python, Node.js depending on the task" },
    ],
    links: [],
    stats: [
      { value: "5+", label: { vi: "Công cụ", en: "Tools" }, icon: "Puzzle" },
      { value: "3", label: { vi: "Nền tảng", en: "Platforms" }, icon: "Boxes" },
      { value: "3", label: { vi: "Ngôn ngữ", en: "Languages" }, icon: "Cpu" },
    ],
    moduleGroups: [
      { title: "Telegram", icon: "Send", items: ["tk_note", "Telegram helper tools"] },
      { title: "Instagram", icon: "ShieldCheck", items: ["ins_check_go", "ins_verify_image_video_go"] },
      { title: { vi: "AI / Media", en: "AI / Media" }, icon: "Radio", items: ["voice_elevenLABS (TTS)"] },
    ],
  },
]

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug)
}
