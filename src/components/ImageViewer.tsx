import React, { useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, Move, Eye, EyeOff } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { BoundingBoxOverlay } from './BoundingBoxOverlay';

export const ImageViewer: React.FC = () => {
  const { currentPacket, currentPage, showBoundingBoxes, setShowBoundingBoxes } = useData();
  const viewerRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = React.useState(100);

  const currentImage = currentPacket?.images.find(img => img.page === currentPage);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 500));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 25));

  if (!currentImage) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">No image selected</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Toolbar */}
      <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">
            Page {currentPage} of {currentPacket?.images.length}
          </span>
          <span className="text-sm text-gray-500">
            MHG {currentPacket?.mhg}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
            className={`p-2 rounded-lg transition-colors ${
              showBoundingBoxes
                ? 'bg-blue-100 text-blue-600'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Toggle Provenance (P)"
          >
            {showBoundingBoxes ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          
          <div className="border-r border-gray-300 h-6"></div>
          
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4 text-gray-600" />
          </button>
          
          <span className="text-sm text-gray-600 min-w-[4rem] text-center">
            {zoomLevel}%
          </span>
          
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4 text-gray-600" />
          </button>
          
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Pan">
            <Move className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Image Display */}
      <div className="flex-1 relative overflow-hidden">
        <div 
          ref={viewerRef}
          className="w-full h-full flex items-center justify-center p-4"
        >
          <div className="relative">
            <img
              src={currentImage.signedUrl}
              alt={`Page ${currentPage}`}
              style={{ transform: `scale(${zoomLevel / 100})` }}
              className="max-w-full max-h-full object-contain transition-transform duration-200 origin-center shadow-lg"
            />
            
            {showBoundingBoxes && (
              <BoundingBoxOverlay 
                imageScale={zoomLevel / 100}
                page={currentPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};