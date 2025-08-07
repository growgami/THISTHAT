'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function TwitterSignIn() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  
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

  // Check for refresh token errors and trigger re-authentication
  useEffect(() => {
    if (session?.error === 'RefreshTokenInvalid') {
      // Trigger re-authentication
      signIn('twitter', { callbackUrl });
    }
  }, [session, callbackUrl]);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('twitter', { 
        callbackUrl: callbackUrl,
        redirect: true 
      });
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut({ 
        callbackUrl: callbackUrl,
        redirect: true 
      });
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full border border-primary"
            />
          )}
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-primary">{session.user?.name}</p>
            <p className="text-xs text-secondary">@{session.user?.name?.toLowerCase().replace(/\s+/g, '')}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          disabled={isLoading}
          className="px-3 py-1.5 text-sm bg-transparent border border-primary text-primary hover:bg-primary hover:text-background transition-all duration-200 rounded-md disabled:opacity-50"
        >
          {isLoading ? 'Signing out...' : 'Sign out'}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading}
      className="flex items-center space-x-2 px-4 py-2 bg-primary text-background hover:bg-primary-hover transition-colors duration-200 rounded-md font-medium disabled:opacity-50"
    >
      {!isLoading && (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      )}
      <span>{isLoading ? 'Connecting...' : 'Sign in with Twitter'}</span>
    </button>
  );
}
