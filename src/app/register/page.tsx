// src/app/register/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/utils/validation';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const [error, setError] = useState('');
  const router = useRouter();
  const { register: registerUser, login } = useAuth();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: any) => {
    try {
      setError('');
      
      // Create the user
      await registerUser(data);
      
      // Log them in
      await login(data.email, data.password);
      
      router.push('/dashboard');
      router.refresh();
    } catch (e: any) {
      console.error('Registration error:', e);
      setError(e.message || 'Registration failed');
    }
  };


  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Name
            </label>
            <input
              {...register('name')}
              type="text"
              className="w-full p-2 border rounded-lg"
              placeholder="Your name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.name.message as string}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              className="w-full p-2 border rounded-lg"
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message as string}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              className="w-full p-2 border rounded-lg"
              placeholder="********"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message as string}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="passwordConfirm">
              Confirm Password
            </label>
            <input
              {...register('passwordConfirm')}
              type="password"
              className="w-full p-2 border rounded-lg"
              placeholder="********"
            />
            {errors.passwordConfirm && (
              <p className="mt-1 text-sm text-red-600">
                {errors.passwordConfirm.message as string}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}

