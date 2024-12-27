import React from 'react';
import { LogOut, Home, Database, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/logout');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-600 text-white">
        {/* Logo section */}
        <div className="p-4 border-b border-indigo-500">
          <div className="bg-white text-indigo-600 rounded-lg p-2">
            <h1 className="text-xl font-bold">SaaS App</h1>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="mt-8 px-4">
          <a 
            href="/dashboard" 
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Home size={20} />
            <span>Homepage</span>
          </a>
          
          <a 
            href="/dashboard/data" 
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Database size={20} />
            <span>Data</span>
          </a>
          
          <a 
            href="/dashboard/account" 
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <User size={20} />
            <span>Account</span>
          </a>
        </nav>

        {/* User section at bottom */}
        <div className="absolute bottom-0 w-64 p-4 border-t border-indigo-500">
          <div className="flex items-center justify-between">
            <span className="truncate">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-indigo-700 rounded-lg transition-colors"
              aria-label="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
