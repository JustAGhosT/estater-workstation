import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Estate Research Workstation
        </h2>
        <p className="text-gray-600 mb-6">
          Research South African estate files with AI-powered extraction and provenance tracking.
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/navigator"
            className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Research → Navigator
          </Link>
          
          <div className="text-sm text-gray-500">
            <p className="mb-2"><strong>Quick Start:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Enter an MHG reference (e.g., 2322/60)</li>
              <li>View estate document pages</li>
              <li>Extract J294 form data</li>
              <li>Approve and export provenance package</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}