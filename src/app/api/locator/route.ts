import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const LocatorRequest = z.object({
  mhg: z.string(),
  year: z.number().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mhg, year } = LocatorRequest.parse(body)
    
    // Generate deterministic packetId from MHG
    const cleanMhg = mhg.replace('/', '-')
    const packetYear = year || 1960
    const packetId = `fs:tab:${packetYear}:mhg-${cleanMhg}`
    
    return NextResponse.json({
      packetId,
      suggestedPages: [1, 2, 3]
    })
  } catch (error) {
    console.error('Locator error:', error)
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}