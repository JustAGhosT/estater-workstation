import React from 'react';
import { useData } from '../contexts/DataContext';

interface BoundingBoxOverlayProps {
  imageScale: number;
  page: number;
}

export const BoundingBoxOverlay: React.FC<BoundingBoxOverlayProps> = ({ imageScale, page }) => {
  const { extractedData } = useData();

  if (!extractedData) return null;

  const pageCitations = extractedData.citations.filter(c => c.page === page);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'border-green-500 bg-green-500';
    if (confidence >= 0.7) return 'border-yellow-500 bg-yellow-500';
    return 'border-red-500 bg-red-500';
  };

  const getFieldLabel = (field: string) => {
    const parts = field.split('.');
    if (parts[0] === 'deceased') {
      return `Deceased: ${parts[1]}`;
    }
    if (parts[0] === 'children') {
      const match = field.match(/children\[(\d+)\]\.(.+)/);
      if (match) {
        const childIndex = parseInt(match[1]);
        const fieldName = match[2];
        return `Child ${childIndex + 1}: ${fieldName}`;
      }
    }
    return field;
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {pageCitations.map((citation, index) => {
        const [x, y, width, height] = citation.bbox;
        const colorClass = getConfidenceColor(citation.confidence);
        
        return (
          <div
            key={index}
            className={`absolute border-2 ${colorClass} bg-opacity-10 hover:bg-opacity-20 transition-all cursor-pointer pointer-events-auto`}
            style={{
              left: `${x * imageScale}px`,
              top: `${y * imageScale}px`,
              width: `${width * imageScale}px`,
              height: `${height * imageScale}px`,
              transform: 'translate(-50%, -50%)',
              transformOrigin: 'center'
            }}
            title={`${getFieldLabel(citation.field)} (${Math.round(citation.confidence * 100)}% confidence)`}
          >
            {/* Confidence indicator */}
            <div className={`absolute -top-6 left-0 px-2 py-1 text-xs font-medium text-white rounded shadow-sm ${
              citation.confidence >= 0.9 ? 'bg-green-600' :
              citation.confidence >= 0.7 ? 'bg-yellow-600' : 'bg-red-600'
            }`}>
              {Math.round(citation.confidence * 100)}%
            </div>
          </div>
        );
      })}
    </div>
  );
};