'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/DashboardLayout';
import { pb } from '@/lib/pocketbase';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Validation schema
const createDemoSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim()
    // Prevent XSS by disallowing HTML-like content
    .refine(val => !/<[^>]*>/g.test(val), 'HTML tags are not allowed'),
});

type CreateDemoForm = z.infer<typeof createDemoSchema>;

export default function CreateDemo() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Handle authentication check with useEffect
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateDemoForm>({
    resolver: zodResolver(createDemoSchema)
  });

  const onSubmit = async (data: CreateDemoForm) => {
    try {
      setIsSubmitting(true);
      setError('');

      // Sanitize input before sending to server
      const sanitizedName = data.name.trim();

      // Additional security check
      if (!user?.id) {
        throw new Error('Authentication required');
      }

      await pb.collection('demos').create({
        name: sanitizedName,
        user: user.id,
        // Add created timestamp
        created: new Date().toISOString(),
      });

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      // Handle specific error cases
      if (err.status === 401) {
        setError('Your session has expired. Please log in again.');
        router.push('/login');
      } else if (err.status === 403) {
        setError('You do not have permission to create demos');
      } else {
        setError(err.message || 'Failed to create demo');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  // Don't render anything while redirecting
  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Create New Demo</h1>
            <p className="text-gray-600 mt-1">Enter the details for your new demo</p>
          </div>

          {error && (
            <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Demo Name
              </label>
              <input
                type="text"
                id="name"
                {...register('name')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter demo name"
                maxLength={100}
                autoComplete="off"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Demo'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
