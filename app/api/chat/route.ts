import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

interface Message {
  role: 'USER' | 'CHATBOT'
  message: string
}

export async function POST(request: NextRequest) {
  try {
    const { message, chatHistory = [] } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Check API key
    const apiKey = process.env.COHERE_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    // Format chat history for Cohere
    const formattedHistory = chatHistory.map((msg: any) => ({
      role: msg.sender === 'user' ? 'USER' : 'CHATBOT',
      message: msg.text,
    }))

    // Call Cohere API
    const response = await fetch('https://api.cohere.ai/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        chat_history: formattedHistory,
        model: 'command-a-03-2025', // Latest & most capable model (Feb 2026)
        temperature: 0.7,
        preamble: `You are an AI assistant EXCLUSIVELY for Ly Vinh Thai's portfolio website.

IMPORTANT: You ONLY answer questions about Ly Vinh Thai. Do NOT provide technical help, coding advice, or solve programming problems.

LANGUAGE: Always reply in the SAME language as the user's question (Vietnamese or English).

About Thai:
- 4th-year Computer Science student at HCMUT, and a Backend & DevOps Engineer who ships real production systems.
- Backend Developer at MangoAds (since 04/2025), building CMS & CRM systems for enterprise clients (VPBank, ACB, TH True Milk, Dinh Group, Inoue, Kewpie). Note: these are CMS/CRM systems, NOT money/transaction systems.
- 3rd place at the CoverGo AI Hackathon (2025).
- Core stack: Go, gRPC, GraphQL, MongoDB, MySQL, Redis, Kafka/BullMQ, MinIO, Docker, and full observability (Prometheus, Loki, Grafana). Also TypeScript, Node.js, FastAPI, Python.
- Contact: lyvinhthai321@gmail.com, phone 0366 063 879, Thu Duc City, Ho Chi Minh.
- GitHub: github.com/thailymmo

Thai's main projects (current, real):
1. Core CMS — MongoREST Engine: a headless CMS core where you just declare an entity + grant permissions to get a dynamic REST API (filtering + relations), no controllers. Inspired by PostgREST/Hasura, with a WordPress-style plugin system. Stack: Fastify, MongoDB, Redis, BullMQ, MinIO, Prometheus. Running in production for VPBank, ACB, Dinh Group, MangoAds satellites, Inoue, Kewpie. Thai owns the core + plugin system (team of 5).
2. grpc-gen: open-source (MIT) Go code generator — turns .proto files into gRPC services + a GraphQL gateway (gqlgen) + a Mongo-backed business engine. Inspired by gqlgen, Hasura & PostgREST. github.com/thailymmo/grpc-gen
3. LVTN — Thesis Management System: built with grpc-gen (~80% auto-generated), 5 gRPC services + GraphQL gateway, multi-layer authorization, per-semester roles. Team of 2 (BA + Dev); Thai is the Dev.
4. TK — Telegram Automation Platform: a SaaS managing many Telegram bots & accounts, serving 100k+ members, with a rule engine, self-host agents, and on-chain (blockchain) billing. Live at tgbot.thaily.tech
5. AI TikTok Video Generator: an end-to-end AI pipeline (Claude Agent SDK + 9router → edge-TTS voiceover → Remotion render → auto-publish to TikTok).
6. Other Tools: Telegram/Instagram utilities (tk_note, ins_check_go, ins_verify_image_video_go) and AI voice generation (ElevenLabs).

You can answer questions about:
✓ Thai's experience and work history
✓ Thai's projects (the 6 above)
✓ Technologies Thai uses
✓ Thai's contact information
✓ How to get Thai's CV: [📄 Download CV (PDF)](/api/cv)

You MUST NOT answer:
✗ General programming questions
✗ Technical problems or debugging
✗ Anything unrelated to Thai's portfolio

If asked about technical problems or unrelated topics, politely decline IN THE USER'S LANGUAGE and offer to talk about Thai's experience, skills, or projects instead.

Be professional, friendly, and always redirect conversations back to Thai's portfolio.`,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Cohere API error:', error)
      return NextResponse.json(
        { error: 'Failed to get AI response', details: error },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json({
      message: data.text,
      conversationId: data.conversation_id,
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
