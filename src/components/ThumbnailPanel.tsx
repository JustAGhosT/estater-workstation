import React from 'react';
import { FileText } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export const ThumbnailPanel: React.FC = () => {
  const { currentPacket, currentPage, setCurrentPage } = useData();

  if (!currentPacket) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <p className="text-gray-500 text-sm">No packet loaded</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="font-medium text-gray-900">MHG {currentPacket.mhg}</h3>
        </div>
        <p className="text-sm text-gray-500">
          {currentPacket.images.length} pages • TAB {currentPacket.year}
        </p>
        {currentPacket.suggestedPages.length > 0 && (
          <p className="text-xs text-blue-600 mt-1">
            Suggested J294: {currentPacket.suggestedPages.join(', ')}
          </p>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {currentPacket.images.map((image) => (
          <div
            key={image.page}
            onClick={() => setCurrentPage(image.page)}
            className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
              currentPage === image.page
                ? 'border-blue-500 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <img
              src={image.thumbnail || image.signedUrl}
              alt={`Page ${image.page}`}
              className="w-full aspect-[3/4] object-cover"
            />
            
            {/* Page indicator */}
            <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${
              currentPage === image.page
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 shadow-sm'
            }`}>
              {image.page}
            </div>

            {/* Suggested indicator */}
            {currentPacket.suggestedPages.includes(image.page) && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full"></div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation hint */}
      <div className="p-3 border-t border-gray-200 text-xs text-gray-500">
        Use ←/→ keys to navigate
      </div>
    </div>
  );
};