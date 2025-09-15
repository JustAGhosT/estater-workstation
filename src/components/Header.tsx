import React from 'react';
import { Search, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Search className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-900">Estate Research Workstation</h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                {user.role}
              </span>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-gray-500" />
            </button>
            <button
              onClick={logout}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 text-gray-500" />
            </button>
          </>
        ) : (
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};