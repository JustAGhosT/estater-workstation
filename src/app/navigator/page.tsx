'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NavigatorPage() {
  const [mhg, setMhg] = useState('')
  const [year, setYear] = useState('1960')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mhg.trim()) return

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/locator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mhg: mhg.trim(), year: parseInt(year) })
      })

      if (!response.ok) {
        throw new Error('Failed to locate packet')
      }

      const data = await response.json()
      router.push(`/packet/${encodeURIComponent(data.packetId)}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Archive Navigator</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="mhg" className="block text-sm font-medium text-gray-700 mb-2">
              MHG Reference
            </label>
            <input
              id="mhg"
              type="text"
              value={mhg}
              onChange={(e) => setMhg(e.target.value)}
              placeholder="e.g., 2322/60"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
              Year (optional)
            </label>
            <input
              id="year"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              min="1950"
              max="1970"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !mhg.trim()}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Locating Packet...' : 'Open Packet'}
          </button>
        </form>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Sample MHG References</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <button
              onClick={() => setMhg('2322/60')}
              className="block hover:text-blue-600 cursor-pointer"
            >
              2322/60 (Meyer estate, 1960)
            </button>
            <button
              onClick={() => setMhg('1845/59')}
              className="block hover:text-blue-600 cursor-pointer"
            >
              1845/59 (Sample estate, 1959)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}