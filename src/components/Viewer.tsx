'use client'

interface PacketImage {
  page: number
  url: string
}

interface ViewerProps {
  images: PacketImage[]
  currentPage: number
  onPageChange: (page: number) => void
  packetId: string
}

export default function Viewer({ images, currentPage, onPageChange, packetId }: ViewerProps) {
  const currentImage = images.find(img => img.page === currentPage)

  if (!currentImage) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 h-full flex items-center justify-center">
        <p className="text-gray-500">No image available</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">
            Page {currentPage} of {images.length}
          </h3>
          <p className="text-sm text-gray-500">Packet: {decodeURIComponent(packetId)}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          <button
            onClick={() => onPageChange(Math.min(images.length, currentPage + 1))}
            disabled={currentPage >= images.length}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Image Display */}
      <div className="flex-1 p-4 flex items-center justify-center bg-gray-50">
        <div className="max-w-full max-h-full">
          <img
            src={currentImage.url}
            alt={`Page ${currentPage}`}
            className="max-w-full max-h-full object-contain shadow-lg rounded"
          />
        </div>
      </div>

      {/* Thumbnails */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-2 overflow-x-auto">
          {images.map((image) => (
            <button
              key={image.page}
              onClick={() => onPageChange(image.page)}
              className={`flex-shrink-0 w-16 h-20 border-2 rounded overflow-hidden ${
                currentPage === image.page
                  ? 'border-blue-500'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image.url}
                alt={`Page ${image.page}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Use ← → arrow keys to navigate
        </p>
      </div>
    </div>
  )
}