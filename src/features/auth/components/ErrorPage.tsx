'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const error = searchParams.get('error');
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  
  const errorMessages: Record<string, string> = {
    'Configuration': 'There is a problem with the server configuration.',
    'AccessDenied': 'You do not have permission to sign in.',
    'Verification': 'The verification token has expired or has already been used.',
    'RefreshTokenInvalid': 'Your session has expired. Please sign in again.',
    'Default': 'An unknown error occurred. Please try again later.'
  };
  
  const errorMessage = error && error in errorMessages 
    ? errorMessages[error] 
    : errorMessages['Default'];
  
  const handleRetry = () => {
    router.push(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {errorMessage}
          </p>
        </div>
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="mt-4">
              <button
                onClick={handleRetry}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/')}
                className="mt-3 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
