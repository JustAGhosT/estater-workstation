import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { J294 } from '@/lib/schema'

const ExtractRequest = z.object({
  packetId: z.string(),
  pages: z.array(z.number())
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { packetId, pages } = ExtractRequest.parse(body)
    
    // Return mock J294 extraction (MEYER sample)
    const mockExtraction = {
      formType: "J294" as const,
      deceased: {
        fullName: "Esaias Engelbertus Meyer",
        deathDate: "1960-04-09",
        deathPlace: "Pretoria",
        residence: "Plaas Nooitgedacht, distrik Bronkhorstspruit",
        maritalStatus: "getroud" as const,
        spouse: "Anna Helena Meyer (gebore Erasmus)"
      },
      parents: {},
      children: [
        { name: "Lourens Abraham Meyer", status: "meerderjarig" as const },
        { name: "Helena Elizabeth (gebore Meyer)", spouse: "Aart Booman" },
        { name: "Daniel Jacobus Elardus Meyer", status: "meerderjarig" as const },
        { name: "Esaias Engelbertus Meyer", birth: "1943-07-25", status: "minderjarig" as const },
        { name: "Johannes Erasmus Meyer", birth: "1950-10-25", status: "minderjarig" as const }
      ],
      citations: [
        { sourceId: "mock:img:0001", page: 1, field: "deceased.fullName", bbox: [120, 140, 420, 30] as [number, number, number, number], confidence: 0.99 },
        { sourceId: "mock:img:0001", page: 1, field: "deceased.deathDate", bbox: [120, 200, 160, 28] as [number, number, number, number], confidence: 0.97 },
        { sourceId: "mock:img:0001", page: 1, field: "deceased.deathPlace", bbox: [300, 200, 120, 28] as [number, number, number, number], confidence: 0.95 },
        { sourceId: "mock:img:0001", page: 1, field: "deceased.maritalStatus", bbox: [450, 200, 100, 28] as [number, number, number, number], confidence: 0.92 },
        { sourceId: "mock:img:0002", page: 2, field: "children[0].name", bbox: [100, 150, 250, 25] as [number, number, number, number], confidence: 0.88 }
      ]
    }
    
    // Validate against schema
    const validated = J294.parse(mockExtraction)
    
    return NextResponse.json(validated)
  } catch (error) {
    console.error('Extraction error:', error)
    return NextResponse.json(
      { error: 'Extraction failed' },
      { status: 500 }
    )
  }
}