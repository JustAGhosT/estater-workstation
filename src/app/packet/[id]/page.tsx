'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Viewer from '@/components/Viewer'
import ExtractionPanel from '@/components/ExtractionPanel'
import { J294Type } from '@/lib/schema'

interface PacketImage {
  page: number
  url: string
}

export default function PacketPage() {
  const params = useParams()
  const packetId = params.id as string
  
  const [images, setImages] = useState<PacketImage[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [extractedData, setExtractedData] = useState<J294Type | null>(null)
  const [caseId, setCaseId] = useState<string | null>(null)

  useEffect(() => {
    const loadImages = async () => {
      try {
        const response = await fetch(`/api/images?packetId=${encodeURIComponent(packetId)}`)
        if (response.ok) {
          const data = await response.json()
          setImages(data.pages)
        }
      } catch (error) {
        console.error('Failed to load images:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (packetId) {
      loadImages()
    }
  }, [packetId])

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    } else if (e.key === 'ArrowRight' && currentPage < images.length) {
      setCurrentPage(prev => prev + 1)
    }
  }, [currentPage, images.length])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading packet...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-120px)] flex gap-6">
      {/* Viewer */}
      <div className="flex-1">
        <Viewer
          images={images}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          packetId={packetId}
        />
      </div>

      {/* Extraction Panel */}
      <div className="w-96">
        <ExtractionPanel
          packetId={packetId}
          images={images}
          extractedData={extractedData}
          onExtractedData={setExtractedData}
          caseId={caseId}
          onCaseId={setCaseId}
        />
      </div>
    </div>
  )
}