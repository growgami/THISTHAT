import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';
import type { AuthStatus, UserSession } from '../lib/auth';

export function useAuth() {
  const { data: session, status } = useSession();

  // Handle refresh token errors
  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      // Force sign in to hopefully resolve error
      signIn();
    }
  }, [session?.error]);

  return {
    // Session data
    session: session as UserSession | null,
    user: session?.user || null,
    
    // Auth state
    status: status as AuthStatus,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    isUnauthenticated: status === 'unauthenticated',
    
    // Access tokens
    accessToken: session?.accessToken || null,
    refreshToken: session?.refreshToken || null,
    
    // User info helpers
    userId: session?.user?.id || null,
    userEmail: session?.user?.email || null,
    userName: session?.user?.name || null,
    userImage: session?.user?.image || null,
  };
}

export default useAuth;