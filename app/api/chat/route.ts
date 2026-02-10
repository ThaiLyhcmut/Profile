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
        preamble: `You are an AI assistant for Ly Vinh Thai's portfolio website.
Thai is a 4th-year Computer Science student at HCMUT (Ho Chi Minh City University of Technology).
He is a Backend Developer at MangoAds, working on enterprise projects like VPBank, ACB, TH True Milk.
His skills include: Golang, Node.js, TypeScript, Python, gRPC, GraphQL, Kafka, Docker, Kubernetes.
He specializes in backend development, microservices, and DevOps.

Be helpful, professional, and friendly. Answer questions about Thai's:
- Experience and skills
- Projects (Thesis Management System, Smart Home IoT, E-commerce)
- Technologies he uses
- Contact information: lyvinhthai321@gmail.com, 0366 063 879
- Location: Thu Duc City, Ho Chi Minh

If asked about topics unrelated to Thai or his portfolio, politely redirect to topics about Thai's work and experience.`,
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
