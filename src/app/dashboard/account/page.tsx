'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { User, Lock } from 'lucide-react';
import { pb } from '@/lib/pocketbase';
import { z } from 'zod';

const passwordSchema = z.object({
  oldPassword: z.string().min(1, 'Current password is required'),
  password: z.string().min(8, 'New password must be at least 8 characters'),
  passwordConfirm: z.string().min(1, 'Password confirmation is required')
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords don't match",
  path: ["passwordConfirm"],
});

export default function AccountPage() {
  const { user, isLoading, login } = useAuth();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    password: '',
    passwordConfirm: ''
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateStatus(null);
    
    try {
      passwordSchema.parse(passwordData);
      setIsUpdating(true);
      
      await pb.collection('users').update(user.id, {
        oldPassword: passwordData.oldPassword,
        password: passwordData.password,
        passwordConfirm: passwordData.passwordConfirm,
        username: user.username
      });

      try {
        await login(user.email, passwordData.password);
        
        setPasswordData({
          oldPassword: '',
          password: '',
          passwordConfirm: ''
        });
        
        setUpdateStatus({
          type: 'success',
          message: 'Password updated successfully'
        });
      } catch (loginError) {
        setUpdateStatus({
          type: 'error',
          message: 'Password updated but auto re-login failed. Please log in again.'
        });
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        setUpdateStatus({
          type: 'error',
          message: error.errors[0].message
        });
      } else {
        let message = 'An unexpected error occurred';
        
        if (error.status === 400) {
          message = 'Missing required values';
        } else if (error.status === 403) {
          message = 'Current password is incorrect';
        } else if (error.status === 404) {
          message = 'Account not found';
        }
        
        setUpdateStatus({
          type: 'error',
          message
        });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 bg-indigo-600">
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-500 p-3 rounded-full">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Account Details</h1>
                <p className="text-indigo-100">Your account information</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <dl className="space-y-6 divide-y divide-gray-200">
              <div className="pt-6 first:pt-0">
                <dt className="text-sm font-medium text-gray-500">Username</dt>
                <dd className="mt-1 text-lg text-gray-900">{user.username}</dd>
              </div>

              <div className="pt-6">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-lg text-gray-900">{user.email}</dd>
              </div>

              <div className="pt-6">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-lg text-gray-900">{user.name || 'Not set'}</dd>
              </div>

              <div className="pt-6">
                <dt className="text-sm font-medium text-gray-500">Account Created</dt>
                <dd className="mt-1 text-lg text-gray-900">
                  {new Date(user.created).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 bg-gray-50 border-b">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-200 p-3 rounded-full">
                <Lock className="h-6 w-6 text-gray-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
            </div>
          </div>

          <div className="p-6">
            {updateStatus && (
              <div 
                className={`mb-4 p-4 rounded-lg ${
                  updateStatus.type === 'success' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {updateStatus.message}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.password}
                  onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.passwordConfirm}
                  onChange={(e) => setPasswordData({ ...passwordData, passwordConfirm: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? 'Updating...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
