import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(request: NextRequest) {
  try {
    // Read CV file from public directory
    const cvPath = join(process.cwd(), 'public', 'CV.pdf')
    const fileBuffer = await readFile(cvPath)

    // Return PDF with proper headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="CV_LyVinhThai.pdf"',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Error serving CV:', error)
    return NextResponse.json(
      { error: 'CV not found' },
      { status: 404 }
    )
  }
}
