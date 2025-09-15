import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ImageViewer } from '../components/ImageViewer';
import { ThumbnailPanel } from '../components/ThumbnailPanel';
import { ExtractionPanel } from '../components/ExtractionPanel';
import { useData } from '../contexts/DataContext';

export const Workstation: React.FC = () => {
  const { packetId } = useParams();
  const { setCurrentPacket, setExtractedData } = useData();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPacket = async () => {
      setIsLoading(true);
      
      // Simulate API call to load packet
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPacket = {
        id: packetId || 'demo',
        mhg: '2322/60',
        year: 1960,
        source: 'familysearch-tab',
        suggestedPages: [1, 2, 3, 4],
        images: [
          { page: 1, signedUrl: 'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg?auto=compress&cs=tinysrgb&w=800', thumbnail: 'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg?auto=compress&cs=tinysrgb&w=200' },
          { page: 2, signedUrl: 'https://images.pexels.com/photos/8111856/pexels-photo-8111856.jpeg?auto=compress&cs=tinysrgb&w=800', thumbnail: 'https://images.pexels.com/photos/8111856/pexels-photo-8111856.jpeg?auto=compress&cs=tinysrgb&w=200' },
          { page: 3, signedUrl: 'https://images.pexels.com/photos/4792264/pexels-photo-4792264.jpeg?auto=compress&cs=tinysrgb&w=800', thumbnail: 'https://images.pexels.com/photos/4792264/pexels-photo-4792264.jpeg?auto=compress&cs=tinysrgb&w=200' },
          { page: 4, signedUrl: 'https://images.pexels.com/photos/4792433/pexels-photo-4792433.jpeg?auto=compress&cs=tinysrgb&w=800', thumbnail: 'https://images.pexels.com/photos/4792433/pexels-photo-4792433.jpeg?auto=compress&cs=tinysrgb&w=200' },
        ]
      };

      setCurrentPacket(mockPacket);
      setIsLoading(false);
    };

    if (packetId) {
      loadPacket();
    }
  }, [packetId, setCurrentPacket]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading packet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Thumbnail Panel */}
      <div className="w-64 border-r border-gray-200 bg-white">
        <ThumbnailPanel />
      </div>
      
      {/* Main Viewer */}
      <div className="flex-1 relative">
        <ImageViewer />
      </div>
      
      {/* Extraction Panel */}
      <div className="w-96 border-l border-gray-200 bg-white">
        <ExtractionPanel />
      </div>
    </div>
  );
};