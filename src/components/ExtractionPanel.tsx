import React, { useState } from 'react';
import { Bot, Download, Check, AlertCircle, Eye } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export const ExtractionPanel: React.FC = () => {
  const { currentPacket, extractedData, setExtractedData } = useData();
  const [isExtracting, setIsExtracting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [editableData, setEditableData] = useState<any>(null);

  const handleExtract = async () => {
    if (!currentPacket) return;
    
    setIsExtracting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockExtraction = {
      formType: 'J294' as const,
      deceased: {
        fullName: 'Esaias Engelbertus Meyer',
        deathDate: '1960-04-09',
        deathPlace: 'Pretoria',
        residence: 'Plaas Nooitgedacht, distrik Bronkhorstspruit',
        maritalStatus: 'getroud',
        spouse: 'Anna Helena Meyer (gebore Erasmus)'
      },
      children: [
        { name: 'Lourens Abraham Meyer', status: 'meerderjarig' },
        { name: 'Helena Elizabeth (gebore Meyer)', spouse: 'Aart Booman' },
        { name: 'Daniel Jacobus Elardus Meyer', status: 'meerderjarig' },
        { name: 'Esaias Engelbertus Meyer', birth: '1943-07-25', status: 'minderjarig' },
        { name: 'Johannes Erasmus Meyer', birth: '1950-10-25', status: 'minderjarig' }
      ],
      citations: [
        { sourceId: 'fs:img:1', page: 1, field: 'deceased.fullName', bbox: [123, 456, 210, 34] as [number, number, number, number], confidence: 0.99 },
        { sourceId: 'fs:img:1', page: 1, field: 'deceased.deathDate', bbox: [400, 456, 120, 28] as [number, number, number, number], confidence: 0.95 },
        { sourceId: 'fs:img:1', page: 1, field: 'deceased.deathPlace', bbox: [550, 456, 100, 28] as [number, number, number, number], confidence: 0.92 },
        { sourceId: 'fs:img:2', page: 2, field: 'children[0].name', bbox: [100, 200, 180, 25] as [number, number, number, number], confidence: 0.88 },
        { sourceId: 'fs:img:2', page: 2, field: 'children[1].name', bbox: [100, 240, 200, 25] as [number, number, number, number], confidence: 0.76 }
      ]
    };
    
    setExtractedData(mockExtraction);
    setEditableData(mockExtraction);
    setIsExtracting(false);
  };

  const handleApprove = async () => {
    if (!editableData) return;
    
    setIsApproving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsApproving(false);
    
    // Show success message
    alert('Data approved and saved to the graph!');
  };

  const handleExport = () => {
    if (!extractedData) return;
    
    // Simulate export
    const exportData = {
      case: extractedData,
      metadata: {
        packetId: currentPacket?.id,
        mhg: currentPacket?.mhg,
        exportedAt: new Date().toISOString(),
        exportedBy: 'researcher@example.com'
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `provpack_${currentPacket?.mhg?.replace('/', '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 bg-green-50';
    if (confidence >= 0.7) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getFieldConfidence = (field: string) => {
    const citation = extractedData?.citations.find(c => c.field === field);
    return citation?.confidence ?? 0;
  };

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
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900">Form Extraction</h3>
          <Bot className="w-5 h-5 text-blue-600" />
        </div>
        
        {!extractedData ? (
          <button
            onClick={handleExtract}
            disabled={isExtracting}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {isExtracting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Extracting...</span>
              </>
            ) : (
              <>
                <Bot className="w-4 h-4" />
                <span>Extract J294</span>
              </>
            )}
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleApprove}
              disabled={isApproving}
              className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isApproving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Approving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Approve</span>
                </>
              )}
            </button>
            
            <button
              onClick={handleExport}
              className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              title="Export Provenance"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Extraction Results */}
      {extractedData && (
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Deceased Information */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 text-sm">Deceased</h4>
            
            {Object.entries(extractedData.deceased).map(([key, value]) => {
              const confidence = getFieldConfidence(`deceased.${key}`);
              return (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </label>
                    {confidence > 0 && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getConfidenceColor(confidence)}`}>
                        {Math.round(confidence * 100)}%
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => setEditableData({
                      ...editableData,
                      deceased: { ...editableData.deceased, [key]: e.target.value }
                    })}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent ${
                      confidence < 0.7 ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Children */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 text-sm">Children</h4>
            
            {extractedData.children.map((child, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-600">Name</label>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getConfidenceColor(getFieldConfidence(`children[${index}].name`))}`}>
                      {Math.round(getFieldConfidence(`children[${index}].name`) * 100)}%
                    </span>
                  </div>
                  <input
                    type="text"
                    value={child.name}
                    onChange={(e) => {
                      const newChildren = [...editableData.children];
                      newChildren[index] = { ...newChildren[index], name: e.target.value };
                      setEditableData({ ...editableData, children: newChildren });
                    }}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                {child.birth && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Birth Date</label>
                    <input
                      type="text"
                      value={child.birth}
                      onChange={(e) => {
                        const newChildren = [...editableData.children];
                        newChildren[index] = { ...newChildren[index], birth: e.target.value };
                        setEditableData({ ...editableData, children: newChildren });
                      }}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
                
                {child.status && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Status</label>
                    <input
                      type="text"
                      value={child.status}
                      onChange={(e) => {
                        const newChildren = [...editableData.children];
                        newChildren[index] = { ...newChildren[index], status: e.target.value };
                        setEditableData({ ...editableData, children: newChildren });
                      }}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
                
                {child.spouse && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Spouse</label>
                    <input
                      type="text"
                      value={child.spouse}
                      onChange={(e) => {
                        const newChildren = [...editableData.children];
                        newChildren[index] = { ...newChildren[index], spouse: e.target.value };
                        setEditableData({ ...editableData, children: newChildren });
                      }}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Confidence Summary */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Confidence Summary</span>
            </div>
            
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span>High confidence (&gt;90%)</span>
                <span className="text-green-600 font-medium">
                  {extractedData.citations.filter(c => c.confidence >= 0.9).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Medium confidence (70-89%)</span>
                <span className="text-yellow-600 font-medium">
                  {extractedData.citations.filter(c => c.confidence >= 0.7 && c.confidence < 0.9).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Low confidence (&lt;70%)</span>
                <span className="text-red-600 font-medium">
                  {extractedData.citations.filter(c => c.confidence < 0.7).length}
                </span>
              </div>
            </div>
            
            {extractedData.citations.filter(c => c.confidence < 0.7).length > 0 && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
                <div className="flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3 text-red-600" />
                  <span className="text-red-600 font-medium">Review required</span>
                </div>
                <span className="text-red-600">Please verify fields with low confidence</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};