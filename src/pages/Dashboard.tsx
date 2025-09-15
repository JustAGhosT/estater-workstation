import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LoginModal } from '../components/LoginModal';

interface RecentPacket {
  id: string;
  mhg: string;
  year: number;
  lastAccessed: string;
  status: 'in-progress' | 'completed' | 'pending';
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mhgInput, setMhgInput] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const recentPackets: RecentPacket[] = [
    { id: '1', mhg: '2322/60', year: 1960, lastAccessed: '2025-01-08', status: 'in-progress' },
    { id: '2', mhg: '1845/59', year: 1959, lastAccessed: '2025-01-07', status: 'completed' },
    { id: '3', mhg: '3456/61', year: 1961, lastAccessed: '2025-01-06', status: 'pending' },
  ];

  const handleNavigate = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!mhgInput.trim()) return;

    setIsNavigating(true);
    // Simulate API call to locate packet
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const packetId = `TAB_${new Date().getFullYear()}_MHG${mhgInput.replace('/', '_')}_demo`;
    navigate(`/workstation/${packetId}`);
    setIsNavigating(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-600';
      case 'in-progress': return 'bg-yellow-100 text-yellow-600';
      case 'pending': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Archive Navigator</h2>
        <p className="text-gray-600">Enter an MHG reference to locate estate files and begin research</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1">
            <label htmlFor="mhg" className="block text-sm font-medium text-gray-700 mb-2">
              MHG Reference
            </label>
            <input
              id="mhg"
              type="text"
              placeholder="e.g., 2322/60"
              value={mhgInput}
              onChange={(e) => setMhgInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleNavigate()}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>
          <button
            onClick={handleNavigate}
            disabled={isNavigating || !mhgInput.trim()}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isNavigating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Locating...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Navigate</span>
              </>
            )}
          </button>
        </div>
        
        <div className="text-sm text-gray-500">
          <p className="mb-1">• TAB estate files (1951-1962 focus for MVP)</p>
          <p className="mb-1">• Automatic J294 page range detection</p>
          <p>• Deep-zoom viewer with extraction capabilities</p>
        </div>
      </div>

      {user && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Packets</h3>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {recentPackets.map((packet) => (
              <div
                key={packet.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                onClick={() => navigate(`/workstation/TAB_${packet.year}_MHG${packet.mhg.replace('/', '_')}_demo`)}
              >
                <div className="flex items-center space-x-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">MHG {packet.mhg}</div>
                    <div className="text-sm text-gray-500">TAB {packet.year}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(packet.status)}`}>
                    {packet.status.replace('-', ' ')}
                  </span>
                  <div className="text-sm text-gray-500">
                    {packet.lastAccessed}
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
};