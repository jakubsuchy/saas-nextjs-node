'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';


const LogoutPage = () => {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Handle cleanup and logout
    const handleLogout = async () => {
      try {
        await logout();
        router.push('/login');
      } catch (error) {
        console.error('Logout failed:', error);
        // Still redirect to login in case of error
        router.push('/login');
      }
    };

    handleLogout();
  }, [logout, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold mb-2">Logging out...</h1>
        <p className="text-gray-600">Please wait while we securely log you out.</p>
      </div>
    </div>
  );
};

export default LogoutPage;
