'use client'

import { useState } from 'react'
import { J294Type } from '@/lib/schema'

interface PacketImage {
  page: number
  url: string
}

interface ExtractionPanelProps {
  packetId: string
  images: PacketImage[]
  extractedData: J294Type | null
  onExtractedData: (data: J294Type | null) => void
  caseId: string | null
  onCaseId: (id: string | null) => void
}

export default function ExtractionPanel({
  packetId,
  images,
  extractedData,
  onExtractedData,
  caseId,
  onCaseId
}: ExtractionPanelProps) {
  const [isExtracting, setIsExtracting] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const handleExtract = async () => {
    setIsExtracting(true)
    try {
      const response = await fetch('/api/extract/j294', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packetId,
          pages: images.map(img => img.page)
        })
      })

      if (response.ok) {
        const data = await response.json()
        onExtractedData(data)
      }
    } catch (error) {
      console.error('Extraction failed:', error)
    } finally {
      setIsExtracting(false)
    }
  }

  const handleApprove = async () => {
    if (!extractedData) return

    setIsApproving(true)
    try {
      const response = await fetch('/api/review/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packetId,
          extractedData
        })
      })

      if (response.ok) {
        const data = await response.json()
        onCaseId(data.caseId)
      }
    } catch (error) {
      console.error('Approval failed:', error)
    } finally {
      setIsApproving(false)
    }
  }

  const handleExport = async () => {
    if (!caseId) return

    setIsExporting(true)
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `provpack_${packetId.replace(/[^a-zA-Z0-9]/g, '_')}.zip`
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <h3 className="font-medium text-gray-900 mb-4">J294 Extraction</h3>
        
        <div className="space-y-2">
          <button
            onClick={handleExtract}
            disabled={isExtracting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExtracting ? 'Extracting...' : 'Extract J294'}
          </button>

          {extractedData && !caseId && (
            <button
              onClick={handleApprove}
              disabled={isApproving}
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isApproving ? 'Approving...' : 'Approve'}
            </button>
          )}

          {caseId && (
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? 'Exporting...' : 'Export Provpack'}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {!extractedData ? (
          <div className="text-center text-gray-500 py-8">
            <p>Click "Extract J294" to analyze the document pages</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Deceased */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Deceased Person</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Name:</span> {extractedData.deceased.fullName}
                </div>
                <div>
                  <span className="font-medium">Death Date:</span> {extractedData.deceased.deathDate}
                </div>
                <div>
                  <span className="font-medium">Death Place:</span> {extractedData.deceased.deathPlace}
                </div>
                {extractedData.deceased.residence && (
                  <div>
                    <span className="font-medium">Residence:</span> {extractedData.deceased.residence}
                  </div>
                )}
                <div>
                  <span className="font-medium">Marital Status:</span> {extractedData.deceased.maritalStatus}
                </div>
                {extractedData.deceased.spouse && (
                  <div>
                    <span className="font-medium">Spouse:</span> {extractedData.deceased.spouse}
                  </div>
                )}
              </div>
            </div>

            {/* Children */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Children ({extractedData.children.length})
              </h4>
              <div className="space-y-3">
                {extractedData.children.map((child, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded border">
                    <div className="font-medium text-sm">{child.name}</div>
                    {child.birth && (
                      <div className="text-xs text-gray-600">Born: {child.birth}</div>
                    )}
                    {child.status && (
                      <div className="text-xs text-gray-600">Status: {child.status}</div>
                    )}
                    {child.spouse && (
                      <div className="text-xs text-gray-600">Spouse: {child.spouse}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Citations */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Citations ({extractedData.citations.length})
              </h4>
              <div className="space-y-2">
                {extractedData.citations.map((citation, index) => (
                  <div key={index} className="text-xs p-2 bg-blue-50 rounded border">
                    <div className="font-medium">{citation.field}</div>
                    <div className="text-gray-600">
                      Page {citation.page} • Confidence: {Math.round(citation.confidence * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {caseId && (
              <div className="p-3 bg-green-50 border border-green-200 rounded">
                <div className="text-sm font-medium text-green-800">
                  ✓ Approved and saved
                </div>
                <div className="text-xs text-green-600">Case ID: {caseId}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}