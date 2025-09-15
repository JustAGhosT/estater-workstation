import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const packetId = searchParams.get('packetId')
  
  if (!packetId) {
    return NextResponse.json(
      { error: 'packetId is required' },
      { status: 400 }
    )
  }
  
  // Return mock pages
  const pages = [
    { page: 1, url: '/mock/pages/0001.jpg' },
    { page: 2, url: '/mock/pages/0002.jpg' },
    { page: 3, url: '/mock/pages/0003.jpg' }
  ]
  
  return NextResponse.json({ pages })
}