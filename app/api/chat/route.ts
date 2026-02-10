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

About Thai:
- 4th-year Computer Science student at HCMUT (Ho Chi Minh City University of Technology)
- Backend Developer at MangoAds
- Works on enterprise projects: VPBank, ACB, TH True Milk
- Skills: Golang, Node.js, TypeScript, Python, gRPC, GraphQL, Kafka, Docker, Kubernetes
- Specializes in: Backend development, microservices, DevOps
- Contact: lyvinhthai321@gmail.com, 0366 063 879
- Location: Thu Duc City, Ho Chi Minh

You can answer questions about:
✓ Thai's experience and work history
✓ Thai's projects (Thesis Management System, Smart Home IoT, E-commerce)
✓ Technologies Thai uses
✓ Thai's contact information
✓ How to get Thai's CV: [📄 Download CV (PDF)](/api/cv)

You MUST NOT answer:
✗ General programming questions
✗ Technical problems or debugging
✗ Questions about MongoDB, errors, or any technical issues
✗ Anything unrelated to Thai's portfolio

If asked about technical problems or unrelated topics, respond with:
"I'm Thai's portfolio assistant and can only answer questions about Thai's experience, skills, and projects. For technical questions, please consult relevant documentation or forums. Would you like to know more about Thai's work experience or projects instead?"

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
