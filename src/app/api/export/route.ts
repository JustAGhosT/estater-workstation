import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { createProvpack } from '@/lib/zip'
import { NormalizedCaseType } from '@/lib/schema'

const ExportRequest = z.object({
  caseId: z.string()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { caseId } = ExportRequest.parse(body)
    
    // Fetch case data from database
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        persons: true,
        events: {
          include: {
            participants: true
          }
        },
        relationships: true,
        sources: true,
        citations: true
      }
    })
    
    if (!caseData) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      )
    }
    
    // Convert database format to normalized case format
    const normalizedCase: NormalizedCaseType = {
      caseId: caseData.id,
      packetId: caseData.packetId,
      persons: caseData.persons.map(p => ({
        id: p.id,
        primaryName: p.primaryName,
        gender: p.gender as 'M' | 'F' | 'U' | undefined,
        birth: p.birthDate || p.birthPlace ? {
          date: p.birthDate || undefined,
          place: p.birthPlace || undefined
        } : undefined,
        death: p.deathDate || p.deathPlace ? {
          date: p.deathDate || undefined,
          place: p.deathPlace || undefined
        } : undefined
      })),
      events: caseData.events.map(e => ({
        id: e.id,
        type: e.type as 'Death' | 'Probate',
        date: e.date || undefined,
        place: e.place || undefined,
        participants: e.participants.map(p => ({
          personId: p.personId,
          role: p.role
        }))
      })),
      relationships: caseData.relationships.map(r => ({
        type: r.type as 'parentOf' | 'spouseOf',
        from: r.fromId,
        to: r.toId
      })),
      sources: caseData.sources.map(s => ({
        id: s.id,
        repo: s.repo,
        title: s.title,
        packetId: s.packetId
      })),
      citations: caseData.citations.map(c => ({
        sourceId: c.sourceId,
        page: c.page,
        field: c.field,
        bbox: [c.bboxX, c.bboxY, c.bboxW, c.bboxH] as [number, number, number, number],
        confidence: c.confidence
      }))
    }
    
    // Generate provpack zip
    const zipBuffer = await createProvpack(normalizedCase)
    
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="provpack_${caseData.packetId.replace(/[^a-zA-Z0-9]/g, '_')}.zip"`
      }
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Export failed' },
      { status: 500 }
    )
  }
}