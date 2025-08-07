# NextAuth.js Twitter OAuth Implementation Guide

## Table of Contents
- [Overview](#overview)
- [Twitter OAuth Data Access](#twitter-oauth-data-access)
- [Twitter API v2 User Fields](#twitter-api-v2-user-fields)
- [Setup and Configuration](#setup-and-configuration)
- [Implementation](#implementation)
- [Advanced Features](#advanced-features)
- [Types and TypeScript](#types-and-typescript)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

Twitter OAuth integration with NextAuth.js allows you to authenticate users with their Twitter accounts and access comprehensive user profile data including usernames, handles, follower metrics, and much more. This guide covers both OAuth 1.0a and OAuth 2.0 implementations.

## Twitter OAuth Data Access

### What Data Can You Get from Twitter OAuth?

#### **OAuth Payload Data** 
What you get when user confirms OAuth authentication:

```typescript
// Standard OAuth response from Twitter
{
  id: "1234567890",           // User ID
  name: "John Doe",           // Display Name  
  username: "johndoe",        // Handle (@johndoe)
  profile_image_url: "https://...", // Avatar URL
  email: "john@example.com"   // Email (if scope granted)
}
```
## Setup and Configuration

### 1. Twitter Developer Account Setup

1. **Create Twitter Developer Account**
   - Go to [https://developer.twitter.com/](https://developer.twitter.com/)
   - Sign up for a developer account
   - Create a new App in your developer portal

2. **Configure App Settings**
   ```
   App Name: Your App Name
   App Description: Your app description
   Website URL: https://yourdomain.com
   Callback URLs: 
   - http://localhost:3000/api/auth/callback/twitter (development)
   - https://yourdomain.com/api/auth/callback/twitter (production)
   ```

3. **Enable Authentication Settings**
   - OAuth 1.0a: Default (includes email access)
   - OAuth 2.0: Optional (more granular scopes, but no email)
   - User authentication settings: Read access minimum
   - Request email address: Enable for OAuth 1.0a

4. **Get Credentials**
   - **API Key** (Consumer Key)
   - **API Secret** (Consumer Secret)
   - **Client ID** (for OAuth 2.0)
   - **Client Secret** (for OAuth 2.0)

### 2. Next.js Project Setup

#### Installation

```bash
npm install next-auth
# Additional packages for enhanced features
npm install @next-auth/prisma-adapter prisma @prisma/client
```

#### Environment Variables

```env
# .env.local

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Twitter OAuth 1.0a Credentials
TWITTER_CLIENT_ID=your-twitter-api-key
TWITTER_CLIENT_SECRET=your-twitter-api-secret

# Twitter OAuth 2.0 Credentials (if using OAuth 2.0)
TWITTER_ID=your-twitter-client-id
TWITTER_SECRET=your-twitter-client-secret
```

## Implementation

### 1. Basic NextAuth Configuration

#### OAuth 1.0a Implementation (Recommended)

```typescript
// pages/api/auth/[...nextauth].ts
import NextAuth, { NextAuthOptions } from 'next-auth'
import TwitterProvider from 'next-auth/providers/twitter'

export const authOptions: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "1.0a", // Default OAuth 1.0a
      profile(profile) {
        return {
          id: profile.id_str,
          name: profile.name,
          email: profile.email, // Available with OAuth 1.0a
          image: profile.profile_image_url_https,
          username: profile.screen_name,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Store basic Twitter data in token
      if (account && profile) {
        token.username = profile.screen_name
      }
      return token
    },
    async session({ session, token }) {
      // Include Twitter data in session
      session.user.id = token.sub
      session.user.username = token.username
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
}

export default NextAuth(authOptions)
```

#### OAuth 2.0 Implementation (Advanced)

```typescript
// pages/api/auth/[...nextauth].ts
import NextAuth, { NextAuthOptions } from 'next-auth'
import TwitterProvider from 'next-auth/providers/twitter'

export const authOptions: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_ID!,
      clientSecret: process.env.TWITTER_SECRET!,
      version: "2.0", // OAuth 2.0
      authorization: {
        params: {
          scope: "tweet.read users.read follows.read like.read", // Custom scopes
        },
      },
      profile(profile) {
        return {
          id: profile.data.id,
          name: profile.data.name,
          image: profile.data.profile_image_url,
          username: profile.data.username,
        }
      },
    }),
  ],
  // ... rest of configuration
}
```



### 3. Custom Sign-In Component

```typescript
// components/TwitterSignIn.tsx
'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'

export default function TwitterSignIn() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        <span>Loading...</span>
      </div>
    )
  }

  if (session) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md">
        <div className="flex items-center space-x-4">
          <Image
            src={session.user?.image || '/default-avatar.png'}
            alt="Profile"
            width={64}
            height={64}
            className="rounded-full"
          />
          
          <div className="flex-1">
            <h3 className="font-bold text-lg">{session.user?.name}</h3>
            <p className="text-gray-600 dark:text-gray-400">@{session.user?.username}</p>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => signOut()}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={() => signIn('twitter')}
        className="flex items-center space-x-3 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
        <span>Sign in with Twitter</span>
      </button>
      
      <p className="text-sm text-gray-600 text-center max-w-md">
        Sign in with your Twitter account to access the application.
      </p>
    </div>
  )
}
```

### 4. Using Twitter Data in Components

```typescript
// components/TwitterProfile.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

interface TwitterUser {
  id: string
  username: string
  name: string
  image: string
}

export default function TwitterProfile() {
  const { data: session } = useSession()
  const [twitterData, setTwitterData] = useState<TwitterUser | null>(null)
  const [loading, setLoading] = useState(false)

  // Fetch additional Twitter data via your API
  const fetchTwitterData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/twitter/profile')
      const data = await response.json()
      setTwitterData(data)
    } catch (error) {
      console.error('Error fetching Twitter data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user) {
      fetchTwitterData()
    }
  }, [session])

  if (!session) return null

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      {/* Cover Image */}
      <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-500"></div>
      
      {/* Profile Content */}
      <div className="relative px-6 pb-6">
        {/* Profile Image */}
        <div className="absolute -top-16 left-6">
          <img
            src={session.user?.image || '/default-avatar.png'}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-900"
          />
          {session.user.verified && (
            <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-2">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="pt-20">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {session.user?.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {session.user.handle}
              </p>
            </div>
            
            <button
              onClick={fetchTwitterData}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>

          {/* Bio */}
          {session.user.description && (
            <p className="mt-4 text-gray-700 dark:text-gray-300">
              {session.user.description}
            </p>
          )}


        </div>
      </div>
    </div>
  )
}
```

      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch Twitter tweets')
    }

    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    console.error('Twitter API Error:', error)
    res.status(500).json({ error: 'Failed to fetch Twitter tweets' })
  }
}
```

## Types and TypeScript

### Extending NextAuth Types

```typescript
// types/next-auth.d.ts
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      username: string
    } & DefaultSession['user']
  }

  interface User {
    username: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    username: string
  }
}
```

## Best Practices

### 1. Data Privacy and Security

```typescript
// Only request necessary scopes
const scopes = [
  'tweet.read',    // Read tweets
  'users.read',    // Read user profiles
  'follows.read',  // Read follows/followers
  // 'follows.write', // Only if you need to follow/unfollow
  // 'like.read',     // Only if you need like data
  // 'like.write',    // Only if you need to like tweets
]

// Secure token storage
const secureTokenStorage = {
  async storeTokens(userId: string, tokens: any) {
    // Store in encrypted database
    await prisma.userTokens.upsert({
      where: { userId },
      update: {
        accessToken: encrypt(tokens.access_token),
        refreshToken: encrypt(tokens.refresh_token),
        expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
      },
      create: {
        userId,
        accessToken: encrypt(tokens.access_token),
        refreshToken: encrypt(tokens.refresh_token),
        expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
      },
    })
  },
}
```

### 2. Rate Limiting and Caching

```typescript
// lib/twitter-rate-limiter.ts
import { rateLimit } from '@/lib/rate-limiter'

const twitterRateLimit = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 500,
})

export async function rateLimitedTwitterCall(
  userId: string,
  endpoint: string,
  limit: number = 300
) {
  try {
    await twitterRateLimit.check(limit, `twitter_${endpoint}_${userId}`)
    // Make Twitter API call
  } catch {
    throw new Error('Rate limit exceeded')
  }
}

// Cache frequently accessed data
import { redis } from '@/lib/redis'

export async function getCachedTwitterData(userId: string, type: string) {
  const cached = await redis.get(`twitter:${type}:${userId}`)
  if (cached) {
    return JSON.parse(cached)
  }
  
  // Fetch from Twitter API
  const data = await fetchFromTwitter(userId, type)
  
  // Cache for 5 minutes
  await redis.setex(`twitter:${type}:${userId}`, 300, JSON.stringify(data))
  
  return data
}
```

### 3. Error Handling

```typescript
// lib/twitter-error-handler.ts
export class TwitterAPIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message)
    this.name = 'TwitterAPIError'
  }
}

export function handleTwitterError(error: any) {
  if (error.status === 401) {
    throw new TwitterAPIError('Twitter authentication failed', 401, 'UNAUTHORIZED')
  }
  
  if (error.status === 429) {
    throw new TwitterAPIError('Twitter rate limit exceeded', 429, 'RATE_LIMITED')
  }
  
  if (error.status === 403) {
    throw new TwitterAPIError('Twitter access forbidden', 403, 'FORBIDDEN')
  }
  
  throw new TwitterAPIError('Twitter API error', error.status || 500, 'UNKNOWN')
}

// Usage in API routes
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Twitter API call
  } catch (error) {
    const twitterError = handleTwitterError(error)
    res.status(twitterError.statusCode).json({
      error: twitterError.message,
      code: twitterError.code,
    })
  }
}
```

### 4. Performance Optimization

```typescript
// components/TwitterData.tsx with optimizations
import { useSWR } from 'swr'
import { useCallback, useMemo } from 'react'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export function TwitterData() {
  // Use SWR for caching and revalidation
  const { data: profile, error: profileError } = useSWR('/api/twitter/profile', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  if (!session) {
    return <div>Please sign in to view profile</div>
  }

  return (
    <div>
      <h2>{session.user.name} (@{session.user.username})</h2>
    </div>
  )
}
```

## Troubleshooting

### Common Issues and Solutions

#### 1. OAuth Callback Errors

```typescript
// Check callback URL configuration
// Development: http://localhost:3000/api/auth/callback/twitter
// Production: https://yourdomain.com/api/auth/callback/twitter

// Ensure NEXTAUTH_URL is set correctly
if (!process.env.NEXTAUTH_URL) {
  throw new Error('NEXTAUTH_URL environment variable is required')
}
```

#### 2. Email Access Issues

```typescript
// For email access, use OAuth 1.0a and enable email in Twitter app settings
TwitterProvider({
  clientId: process.env.TWITTER_CLIENT_ID!,
  clientSecret: process.env.TWITTER_CLIENT_SECRET!,
  version: "1.0a", // Required for email access
})

// Note: Email is not available with OAuth 2.0
```

#### 3. Rate Limiting Issues

```typescript
// Implement proper rate limiting
const TWITTER_RATE_LIMITS = {
  'users/lookup': { limit: 300, window: 15 * 60 * 1000 },
  'users/followers': { limit: 15, window: 15 * 60 * 1000 },
  'users/following': { limit: 15, window: 15 * 60 * 1000 },
  'tweets/timeline': { limit: 900, window: 15 * 60 * 1000 },
}

// Check rate limits before making calls
async function checkRateLimit(endpoint: string, userId: string) {
  const key = `rate_limit:${endpoint}:${userId}`
  const current = await redis.incr(key)
  
  if (current === 1) {
    await redis.expire(key, TWITTER_RATE_LIMITS[endpoint].window / 1000)
  }
  
  if (current > TWITTER_RATE_LIMITS[endpoint].limit) {
    throw new Error('Rate limit exceeded')
  }
}
```

#### 4. Token Refresh Issues

```typescript
// Implement token refresh for OAuth 2.0
async function refreshTwitterToken(refreshToken: string) {
  const response = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${process.env.TWITTER_ID}:${process.env.TWITTER_SECRET}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to refresh token')
  }

  return response.json()
}
```

### Debug Configuration

```typescript
// Enable debug logging
export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code, metadata) {
      console.error('NextAuth Error:', code, metadata)
    },
    warn(code) {
      console.warn('NextAuth Warning:', code)
    },
    debug(code, metadata) {
      console.debug('NextAuth Debug:', code, metadata)
    },
  },
  // ... rest of config
}
```

This comprehensive guide covers everything you need to implement Twitter OAuth with NextAuth.js, from basic authentication to advanced features like follower data, tweet fetching, and proper error handling. The implementation provides access to extensive Twitter user data while following best practices for security, performance, and reliability. 