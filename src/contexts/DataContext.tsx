import React, { createContext, useContext, useState } from 'react';

interface Citation {
  sourceId: string;
  page: number;
  field: string;
  bbox: [number, number, number, number];
  confidence: number;
}

interface Child {
  name: string;
  birth?: string;
  status?: string;
  spouse?: string;
}

interface Deceased {
  fullName: string;
  deathDate: string;
  deathPlace: string;
  residence?: string;
  maritalStatus?: string;
  spouse?: string;
}

interface J294Data {
  formType: 'J294';
  deceased: Deceased;
  children: Child[];
  citations: Citation[];
}

interface Packet {
  id: string;
  mhg: string;
  year: number;
  source: string;
  images: Array<{ page: number; signedUrl: string; thumbnail?: string }>;
  suggestedPages: number[];
}

interface DataContextType {
  currentPacket: Packet | null;
  setCurrentPacket: (packet: Packet | null) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  extractedData: J294Data | null;
  setExtractedData: (data: J294Data | null) => void;
  showBoundingBoxes: boolean;
  setShowBoundingBoxes: (show: boolean) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPacket, setCurrentPacket] = useState<Packet | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [extractedData, setExtractedData] = useState<J294Data | null>(null);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);

  return (
    <DataContext.Provider value={{
      currentPacket,
      setCurrentPacket,
      currentPage,
      setCurrentPage,
      extractedData,
      setExtractedData,
      showBoundingBoxes,
      setShowBoundingBoxes,
    }}>
      {children}
    </DataContext.Provider>
  );
};