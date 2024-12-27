'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { pb } from '@/lib/pocketbase';

interface Demo {
  id: string;
  name: string;
  created: string;
  updated: string;
}

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [demos, setDemos] = useState<Demo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 12; // Changed to 12 for better grid layout (3x4)

  const fetchDemos = async (page: number) => {
    try {
      setIsLoading(true);
      setError('');

      const resultList = await pb.collection('demos').getList<Demo>(page, ITEMS_PER_PAGE, {
        sort: '-created',
        filter: user?.id ? `user = "${user.id}"` : '',
      });

      setDemos(resultList.items);
      setTotalPages(resultList.totalPages);
    } catch (err: any) {
      setError(err.message || 'Failed to load demos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
    if (user) {
      fetchDemos(currentPage);
    }
  }, [user, authLoading, currentPage, router]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return null;
  }

 return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section stays the same */}
        
        {/* Demos Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Demos</h2>
            <button
            onClick={() => router.push('/dashboard/demos/create')}

            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create a new demo
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : demos.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
              No demos created yet. Click the button above to create your first demo.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {demos.map((demo) => (
                  <div
                    key={demo.id}
                    onClick={() => router.push(`/dashboard/demos/${demo.id}`)}
                    className="group relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer"
                  >
                    <div className="aspect-square w-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors duration-200 p-4">
                      <svg viewBox="0 0 100 100" className="w-full h-full text-indigo-600">
                        {/* Monitor base */}
                        <path
                          d="M35 80 L65 80 L60 90 L40 90 Z"
                          fill="currentColor"
                          opacity="0.9"
                        />
                        {/* Monitor frame */}
                        <rect
                          x="10"
                          y="15"
                          width="80"
                          height="60"
                          rx="4"
                          fill="currentColor"
                          opacity="0.9"
                        />
                        {/* Screen */}
                        <rect
                          x="15"
                          y="20"
                          width="70"
                          height="50"
                          rx="2"
                          fill="white"
                        />
                        {/* Mouse cursor */}
                             <path
                          d="M45 35 L45 55 L50 50 L55 60 L58 58 L53 48 L60 48 Z"
                          fill="currentColor"
                          transform="translate(30, 15) rotate(-15, 50, 70)"
                        />
                      </svg>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors duration-200">
                        {demo.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(demo.created).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
{/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 mt-6 bg-gray-50 rounded-lg">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Page <span className="font-medium">{currentPage}</span> of{' '}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
