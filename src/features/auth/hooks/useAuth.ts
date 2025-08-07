import { useSession, signOut } from 'next-auth/react';
import { useEffect } from 'react';
import type { AuthStatus, UserSession } from '../lib/auth';

export function useAuth() {
  const { data: session, status } = useSession();

  // Handle refresh token errors more gracefully for persistent sessions
  useEffect(() => {
    if (session?.error === 'RefreshTokenInvalid') {
      // Only logout if the refresh token is truly invalid
      console.log('Refresh token is invalid, logging out');
      signOut({ callbackUrl: '/' });
    } else if (session?.error === 'RefreshAccessTokenError') {
      // For temporary refresh errors (e.g., network issues), don't force sign-in
      // This allows for longer session persistence with automatic recovery
      console.log('Temporary refresh error, session may recover automatically');
      // Optionally, we could implement a retry mechanism here
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