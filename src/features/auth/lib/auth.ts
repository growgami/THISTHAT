import { getServerSession } from "next-auth/next"
import { NextAuthOptions } from "next-auth"
import TwitterProvider from "next-auth/providers/twitter"
import "@/types/auth/auth"

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
// Using any here because the JWT callback expects a specific token structure
// TODO: Improve typing when we have a better understanding of the exact structure needed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function refreshAccessToken(token: { refreshToken?: string, accessTokenExpires?: number }): Promise<any> {
  try {
    // Only attempt refresh if we have a refresh token
    if (!token.refreshToken) {
      throw new Error('No refresh token available')
    }

    // Log the refresh attempt for debugging
    console.log('Attempting to refresh token. Token expires at:', new Date(token.accessTokenExpires || 0));

    // For Twitter OAuth 2.0, we need to include the client_id in the body
    // and use the correct authorization header format
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: token.refreshToken,
      client_id: process.env.TWITTER_CLIENT_ID!,
    })

    const response = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`).toString('base64')}`,
      },
      body: params.toString(),
    })

    const refreshedTokens = await response.json()

    console.log('Refresh token response status:', response.status);
    console.log('Refresh token response:', refreshedTokens);

    if (!response.ok) {
      console.error('Failed to refresh token:', response.status, refreshedTokens);
      // If the refresh token is invalid or expired, we should logout the user
      if (response.status === 400) {
        // Common invalid token errors
        if (refreshedTokens.error === 'invalid_request' || 
            refreshedTokens.error === 'invalid_grant' || 
            refreshedTokens.error === 'expired_token') {
          console.log('Refresh token is invalid, marking as invalid');
          return {
            ...token,
            error: 'RefreshTokenInvalid',
          }
        }
      }
      // For other errors, still throw but mark as refresh error
      return {
        ...token,
        error: 'RefreshAccessTokenError',
      }
    }

    // Successfully refreshed tokens
    console.log('Successfully refreshed tokens, new expiration:', new Date(Date.now() + (refreshedTokens.expires_in * 1000)));
    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + (refreshedTokens.expires_in * 1000),
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    }
  } catch (error) {
    console.error('Error refreshing access token:', error)
    // If we get a network error or other unexpected error, still mark as refresh error
    // but don't automatically logout the user to maintain persistent session
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
    })
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // Initial sign in
      if (account && user) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        // Extend default expiration to 30 days (but will be refreshed proactively)
        token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : Date.now() + 30 * 24 * 60 * 60 * 1000
        // Store user information in the token
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        }
        return token
      }

      // Return previous token if the access token has not expired yet
      // Add 5 minute buffer to refresh tokens before they actually expire
      if (Date.now() < ((token.accessTokenExpires as number) - 5 * 60 * 1000)) {
        return token
      }

      // Access token has expired, try to update it
      const refreshedToken = await refreshAccessToken(token)
      
      // If the refresh token is invalid and cannot be refreshed anymore, mark it as such
      if ('error' in refreshedToken && refreshedToken.error === 'RefreshTokenInvalid') {
        // Return a token with an error that will be handled by the client
        return {
          ...token,
          error: 'RefreshTokenInvalid',
        }
      }
      
      // If there was a general refresh error, keep the error for client handling
      if ('error' in refreshedToken && refreshedToken.error === 'RefreshAccessTokenError') {
        return refreshedToken;
      }
      
      return refreshedToken
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      session.error = token.error
      
      // Keep existing user properties
      session.user = token.user as typeof session.user
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt",
    // Extend session duration to 30 days
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // Add jwt configuration for automatic refresh
  jwt: {
    // Set secret for signing JWT
    secret: process.env.NEXTAUTH_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// Helper function to get server-side session
export const getAuthSession = () => getServerSession(authOptions)

// Auth status type
export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

// User session type
export interface UserSession {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
  accessToken?: string
  refreshToken?: string
  error?: string
}

// Auth utilities
export const auth = {
  // Check if user is authenticated
  isAuthenticated: (session: UserSession | null): boolean => {
    return !!session?.user
  },
  
  // Get user ID from session
  getUserId: (session: UserSession | null): string | null => {
    return session?.user?.id || null
  },
  
  // Get access token from session
  getAccessToken: (session: UserSession | null): string | null => {
    return session?.accessToken || null
  },
  
  // Get user info from session
  getUserInfo: (session: UserSession | null) => {
    if (!session?.user) return null
    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    }
  }
}
