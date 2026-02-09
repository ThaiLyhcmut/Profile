import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import ClientProviders from "@/components/ClientProviders"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Lý Vĩnh Thái - Backend Developer & DevOps Engineer",
  description:
    "Portfolio của Lý Vĩnh Thái - Backend Developer & DevOps Engineer (Fresher) từ HCMUT. Specializing in Golang, Node.js, GraphQL, gRPC, and Distributed Systems.",
  keywords: ["Backend Developer", "DevOps Engineer", "Golang", "Node.js", "GraphQL", "gRPC", "Vietnam"],
  generator: "v0.app",
  authors: [{ name: "Lý Vĩnh Thái", url: "https://github.com/ThaiLyhcmut" }],
  openGraph: {
    title: "Lý Vĩnh Thái - Backend Developer & DevOps Engineer",
    description: "Portfolio showcasing projects from GitHub",
    url: "https://your-portfolio-url.com",
    type: "website",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <ClientProviders>
          {children}
        </ClientProviders>
        <Analytics />
      </body>
    </html>
  )
}
