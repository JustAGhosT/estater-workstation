import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '@/lib/db'
import { J294, NormalizedCase } from '@/lib/schema'
import { normalizePersonName, normalizeDate } from '@/lib/normalize'

const ApproveRequest = z.object({
  packetId: z.string(),
  extractedData: J294
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { packetId, extractedData } = ApproveRequest.parse(body)
    
    const caseId = uuidv4()
    
    // Convert J294 to normalized case
    const deceasedId = uuidv4()
    const sourceId = uuidv4()
    const deathEventId = uuidv4()
    
    const persons = [
      {
        id: deceasedId,
        primaryName: normalizePersonName(extractedData.deceased.fullName).primary,
        gender: 'U' as const,
        birth: undefined,
        death: {
          date: normalizeDate(extractedData.deceased.deathDate),
          place: extractedData.deceased.deathPlace
        }
      }
    ]
    
    // Add children
    const children = extractedData.children.map(child => ({
      id: uuidv4(),
      primaryName: normalizePersonName(child.name).primary,
      gender: 'U' as const,
      birth: child.birth ? { date: normalizeDate(child.birth), place: undefined } : undefined,
      death: undefined
    }))
    
    persons.push(...children)
    
    // Create relationships (parent-child)
    const relationships = children.map(child => ({
      type: 'parentOf' as const,
      from: deceasedId,
      to: child.id
    }))
    
    // Add spouse if present
    if (extractedData.deceased.spouse) {
      const spouseId = uuidv4()
      persons.push({
        id: spouseId,
        primaryName: normalizePersonName(extractedData.deceased.spouse).primary,
        gender: 'U' as const,
        birth: undefined,
        death: undefined
      })
      
      relationships.push({
        type: 'spouseOf' as const,
        from: deceasedId,
        to: spouseId
      })
    }
    
    const normalizedCase = {
      caseId,
      packetId,
      persons,
      events: [
        {
          id: deathEventId,
          type: 'Death' as const,
          date: normalizeDate(extractedData.deceased.deathDate),
          place: extractedData.deceased.deathPlace,
          participants: [{ personId: deceasedId, role: 'deceased' }]
        }
      ],
      relationships,
      sources: [
        {
          id: sourceId,
          repo: 'familysearch-tab',
          title: `Estate file ${packetId}`,
          packetId
        }
      ],
      citations: extractedData.citations
    }
    
    // Validate normalized case
    const validated = NormalizedCase.parse(normalizedCase)
    
    // Save to database in transaction
    await prisma.$transaction(async (tx) => {
      // Create case
      await tx.case.create({
        data: {
          id: caseId,
          packetId
        }
      })
      
      // Create persons
      for (const person of validated.persons) {
        await tx.person.create({
          data: {
            id: person.id,
            caseId,
            primaryName: person.primaryName,
            gender: person.gender,
            birthDate: person.birth?.date,
            birthPlace: person.birth?.place,
            deathDate: person.death?.date,
            deathPlace: person.death?.place
          }
        })
      }
      
      // Create events
      for (const event of validated.events) {
        await tx.event.create({
          data: {
            id: event.id,
            caseId,
            type: event.type,
            date: event.date,
            place: event.place
          }
        })
        
        // Create event participants
        for (const participant of event.participants) {
          await tx.eventParticipant.create({
            data: {
              id: uuidv4(),
              eventId: event.id,
              personId: participant.personId,
              role: participant.role
            }
          })
        }
      }
      
      // Create relationships
      for (const relationship of validated.relationships) {
        await tx.relationship.create({
          data: {
            id: uuidv4(),
            caseId,
            type: relationship.type,
            fromId: relationship.from,
            toId: relationship.to
          }
        })
      }
      
      // Create sources
      for (const source of validated.sources) {
        await tx.source.create({
          data: {
            id: source.id,
            caseId,
            repo: source.repo,
            title: source.title,
            packetId: source.packetId
          }
        })
      }
      
      // Create citations
      for (const citation of validated.citations) {
        await tx.citation.create({
          data: {
            id: uuidv4(),
            caseId,
            sourceId: validated.sources[0].id, // Use first source for now
            page: citation.page,
            field: citation.field,
            bboxX: citation.bbox[0],
            bboxY: citation.bbox[1],
            bboxW: citation.bbox[2],
            bboxH: citation.bbox[3],
            confidence: citation.confidence
          }
        })
      }
    })
    
    return NextResponse.json({ caseId })
  } catch (error) {
    console.error('Approval error:', error)
    return NextResponse.json(
      { error: 'Approval failed' },
      { status: 500 }
    )
  }
}