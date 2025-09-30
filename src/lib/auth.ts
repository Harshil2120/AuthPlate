/* eslint-disable @typescript-eslint/no-explicit-any */
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import EmailProvider from 'next-auth/providers/email'
import clientPromise from './mongodb'
import { env } from './env'
import { logger, SecurityEvents } from './logger'

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!,
    }),
    // Only add GitHub provider if credentials are properly configured
    ...(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET && 
        env.GITHUB_CLIENT_ID !== 'your-github-client-id' && 
        env.GITHUB_CLIENT_SECRET !== 'your-github-client-secret' 
        ? [GitHubProvider({
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
          })]
        : []
    ),
    EmailProvider({
      server: {
        host: env.EMAIL_SERVER_HOST,
        port: parseInt(env.EMAIL_SERVER_PORT || '587'),
        secure: false, // Use TLS
        auth: {
          user: env.EMAIL_SERVER_USER,
          pass: env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: env.EMAIL_FROM,
    }),
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    secret: env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: env.NODE_ENV === 'production',
      },
    },
    callbackUrl: {
      name: env.NODE_ENV === 'production' ? '__Secure-next-auth.callback-url' : 'next-auth.callback-url',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name: env.NODE_ENV === 'production' ? '__Host-next-auth.csrf-token' : 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: env.NODE_ENV === 'production',
      },
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  callbacks: {
    async jwt({ token, user, trigger }: { token: any; user: any; trigger?: string }) {
      if (user) {
        token.id = user.id
        // Regenerate session on sign in
        if (trigger === 'signIn') {
          token.iat = Math.floor(Date.now() / 1000)
          token.jti = require('crypto').randomBytes(16).toString('hex')
        }
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user.id = token.id as string
        // Add session metadata for security
        session.sessionId = token.jti
        session.issuedAt = token.iat
        
        // Session validation is handled by JWT expiration
        // Additional session management can be added here if needed
      }
      return session
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }: { user: any; account: any; profile?: any; isNewUser?: any }) {
      // Log successful sign-ins for monitoring
      logger.authEvent(SecurityEvents.LOGIN_SUCCESS, user.id, {
        userId: user.id,
        metadata: {
          email: user.email,
          provider: account?.provider,
          isNewUser
        }
      })
    },
    async signOut({ session, token }: { session: any; token: any }) {
      // Log sign-outs for monitoring
      logger.authEvent(SecurityEvents.LOGOUT, session?.user?.id, {
        userId: session?.user?.id,
        sessionId: token?.jti
      })
    },
    async createUser({ user }: { user: any }) {
      logger.authEvent('New user created', user.id, {
        userId: user.id,
        metadata: {
          email: user.email
        }
      })
    },
    async linkAccount({ user, account }: { user: any; account: any }) {
      logger.authEvent('Account linked', user.id, {
        userId: user.id,
        metadata: {
          provider: account.provider,
          providerAccountId: account.providerAccountId
        }
      })
    },
  },
  debug: false, // Disable debug to avoid warnings
}
