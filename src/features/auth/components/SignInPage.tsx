'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import TwitterSignIn from '@/features/auth/components/TwitterSignIn';

export default function SignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  // Get the callback URL from query parameters and sanitize it
  let callbackUrl = searchParams.get('callbackUrl') || '/';
  
  // Prevent recursive callback URLs by extracting the base URL
  if (callbackUrl.includes('callbackUrl=')) {
    try {
      // Extract the first callbackUrl parameter
      const urlParams = new URLSearchParams(callbackUrl.split('?')[1] || '');
      callbackUrl = urlParams.get('callbackUrl') || '/';
    } catch (error) {
      // If parsing fails, fall back to root
      console.error('Error parsing callback URL:', error);
      callbackUrl = '/';
    }
  }
  
  // Ensure callbackUrl is a valid path
  if (!callbackUrl.startsWith('/')) {
    callbackUrl = '/';
  }

  useEffect(() => {
    // If user is already authenticated, redirect to callback URL
    if (status === 'authenticated') {
      // Check if there's a refresh token error that requires re-authentication
      if (session?.error === 'RefreshTokenInvalid') {
        // Sign out and trigger re-authentication
        signIn('twitter', { callbackUrl });
      } else {
        router.push(callbackUrl);
      }
    } else if (status !== 'loading') {
      // If not loading and not authenticated, show sign in options
      setIsLoading(false);
    }
  }, [status, router, callbackUrl, session]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to THISTHAT
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Use your Twitter account to sign in
          </p>
        </div>
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <TwitterSignIn />
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  By signing in, you agree to our
                </span>
              </div>
            </div>
            <div className="mt-6 text-center text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Terms of Service
              </a>
              {' and '}
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
