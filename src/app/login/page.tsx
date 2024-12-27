'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/utils/validation';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { pb } from '@/lib/pocketbase';

const emailLinkSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const otpSchema = z.object({
  code: z.string().min(1, 'OTP code is required'),
});

export default function Login() {
  const [error, setError] = useState('');
  const [emailLinkSent, setEmailLinkSent] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [otpId, setOtpId] = useState<string>('');
  const router = useRouter();
  const { login } = useAuth();
  
  // Regular login form
  const { register: registerLogin, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  // Email link form
  const { register: registerEmailLink, handleSubmit: handleEmailLinkSubmit, formState: { errors: emailLinkErrors } } = useForm({
    resolver: zodResolver(emailLinkSchema)
  });

  // OTP verification form
  const { 
    register: registerOtp, 
    handleSubmit: handleOtpSubmit, 
    formState: { errors: otpErrors } 
  } = useForm({
    resolver: zodResolver(otpSchema)
  });

  const onLoginSubmit = async (data: any) => {
    try {
      setError('');
      await login(data.email, data.password);
      router.push('/dashboard');
      router.refresh();
    } catch (e: any) {
      setError(e.message || 'Login failed');
    }
  };

  const onEmailLinkSubmit = async (data: any) => {
    try {
      setIsProcessing(true);
      setError('');
      const result = await pb.collection('users').requestOTP(data.email);
      setOtpId(result.otpId);
      setEmailLinkSent(true);
    } catch (e: any) {
      setError(e.message || 'Failed to send login link');
    } finally {
      setIsProcessing(false);
    }
  };

  const onOTPSubmit = async (data: any) => {
    try {
      setIsProcessing(true);
      setError('');
      const authData = await pb.collection('users').authWithOTP(otpId, data.code);
      router.push('/dashboard');
      router.refresh();
    } catch (e: any) {
      setError(e.message || 'Invalid OTP code');
      setIsProcessing(false);
    }
  };

  if (emailLinkSent) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Check Your Email</h1>
          <p className="text-center text-gray-600 mb-6">
            We've sent you an email with a one-time password. Please enter it below to continue.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleOtpSubmit(onOTPSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="code">
                One Time Code
              </label>
              <input
                {...registerOtp('code')}
                type="text"
                className="w-full p-2 border rounded-lg"
                placeholder="Enter code"
              />
              {otpErrors.code && (
                <p className="mt-1 text-sm text-red-600">
                  {otpErrors.code.message as string}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isProcessing ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>

          <button
            onClick={() => setEmailLinkSent(false)}
            className="w-full mt-4 py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Back to Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Regular Login Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email
              </label>
              <input
                {...registerLogin('email')}
                type="email"
                className="w-full p-2 border rounded-lg"
                placeholder="your@email.com"
              />
              {loginErrors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {loginErrors.email.message as string}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="password">
                Password
              </label>
              <input
                {...registerLogin('password')}
                type="password"
                className="w-full p-2 border rounded-lg"
                placeholder="********"
              />
              {loginErrors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {loginErrors.password.message as string}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Login
            </button>
          </form>
        </div>

        {/* Email Link Login Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-center">Login with Email Link</h2>
          <form onSubmit={handleEmailLinkSubmit(onEmailLinkSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="emailLink">
                Email
              </label>
              <input
                {...registerEmailLink('email')}
                type="email"
                className="w-full p-2 border rounded-lg"
                placeholder="your@email.com"
              />
              {emailLinkErrors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {emailLinkErrors.email.message as string}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
            >
              {isProcessing ? 'Sending...' : 'Send Login Link'}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
