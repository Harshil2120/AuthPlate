/* eslint-disable @typescript-eslint/no-explicit-any */
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import EmailProvider from 'next-auth/providers/email'
import clientPromise from './mongodb'
import { env } from './env'
import { logger, SecurityEvents } from './logger'

// Custom adapter that filters out unnecessary user data and tokens
const customAdapter = {
  ...MongoDBAdapter(clientPromise),
  
  // Override user creation to only store email
  async createUser(user: any) {
    const client = await clientPromise
    const db = client.db()
    const usersCollection = db.collection('users')
    
    // Only store email, ignore name, image, emailVerified
    const cleanUser = {
      email: user.email,
      createdAt: new Date()
    }
    
    const result = await usersCollection.insertOne(cleanUser)
    return { id: result.insertedId.toString(), ...cleanUser }
  },
  
  // Override user update to prevent storing unnecessary fields like emailVerified
  async updateUser(user: any) {
    const client = await clientPromise
    const db = client.db()
    const usersCollection = db.collection('users')
    const { ObjectId } = await import('mongodb')
    
    // Get existing user to preserve email if new email is null
    const existingUser = await usersCollection.findOne({ _id: new ObjectId(user.id) })
    
    // Only update email if provided, ignore emailVerified and other fields
    const cleanUser = {
      email: user.email || existingUser?.email
    }
    
    await usersCollection.updateOne(
      { _id: new ObjectId(user.id) },
      { $set: cleanUser }
    )
    
    return { id: user.id, ...cleanUser }
  },
  
  // Override user retrieval to only return email
  async getUser(id: string) {
    const client = await clientPromise
    const db = client.db()
    const usersCollection = db.collection('users')
    const { ObjectId } = await import('mongodb')
    
    const user = await usersCollection.findOne({ _id: new ObjectId(id) })
    if (!user) return null
    
    // Only return email and id
    return {
      id: user._id.toString(),
      email: user.email
    }
  },
  
  // Override user retrieval by email
  async getUserByEmail(email: string) {
    const client = await clientPromise
    const db = client.db()
    const usersCollection = db.collection('users')
    
    const user = await usersCollection.findOne({ email })
    if (!user) return null
    
    // Only return email and id
    return {
      id: user._id.toString(),
      email: user.email
    }
  },
  
  async linkAccount(account: any) {
    // Clean the account data before storing
    const cleanAccount = {
      userId: account.userId,
      type: account.type,
      provider: account.provider,
      providerAccountId: account.providerAccountId,
      refresh_token: account.refresh_token || null,
      expires_at: account.expires_at || null,
    }
    
    // Use the original adapter's linkAccount method with cleaned data
    return MongoDBAdapter(clientPromise).linkAccount(cleanAccount)
  }
}

export const authOptions = {
  adapter: customAdapter,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile',
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    }),
    // Only add GitHub provider if credentials are properly configured
    ...(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET && 
        env.GITHUB_CLIENT_ID !== 'your-github-client-id' && 
        env.GITHUB_CLIENT_SECRET !== 'your-github-client-secret' 
        ? [GitHubProvider({
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
            authorization: {
              params: {
                scope: 'read:user user:email'
              }
            }
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
    async signIn({ user, account, profile }: { user: any; account: any; profile?: any }) {
      try {
        // Only process if we have an email and account info
        if (!user.email || !account) {
          return true
        }

        // Skip account linking for email provider (magic link) to prevent duplicate account documents
        // Email provider doesn't need account documents as it's not a traditional OAuth provider
        if (account.provider === 'email') {
          return true
        }

        const client = await clientPromise
        const db = client.db()
        const usersCollection = db.collection('users')
        const accountsCollection = db.collection('accounts')

        // Check if there's an existing user with this email
        const existingUser = await usersCollection.findOne({ email: user.email })
        
        if (existingUser) {
          // Check if this provider account is already linked to the existing user
          const existingAccount = await accountsCollection.findOne({
            userId: existingUser._id,
            provider: account.provider,
            providerAccountId: account.providerAccountId
          })

          if (existingAccount) {
            // Account is already linked, allow sign in
            return true
          }

          // Check if this provider account is linked to a different user
          const conflictingAccount = await accountsCollection.findOne({
            provider: account.provider,
            providerAccountId: account.providerAccountId
          })

          if (conflictingAccount && conflictingAccount.userId.toString() !== existingUser._id.toString()) {
            // This provider account is already linked to a different user
            logger.authEvent('Account linking conflict', user.id, {
              userId: user.id,
              metadata: {
                email: user.email,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                conflictingUserId: conflictingAccount.userId.toString()
              }
            })
            return false // Prevent sign in due to conflict
          }

          // Link the account to the existing user
          // Store only essential OAuth data, not unnecessary tokens
          const accountData = {
            userId: existingUser._id,
            type: account.provider,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            // Only store refresh_token if available (for token renewal)
            refresh_token: account.refresh_token || null,
            expires_at: account.expires_at || null
          }

          await accountsCollection.insertOne(accountData)

          // Update the user object to use the existing user's ID
          user.id = existingUser._id.toString()

          logger.authEvent('Account automatically linked', existingUser._id.toString(), {
            userId: existingUser._id.toString(),
            metadata: {
              email: user.email,
              provider: account.provider,
              providerAccountId: account.providerAccountId
            }
          })
        }

        return true
      } catch (error) {
        console.error('Account linking error in signIn callback:', error)
        logger.authEvent('Account linking error in signIn', user.id, {
          userId: user.id,
          metadata: {
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        })
        return true // Allow sign in even if linking fails
      }
    },
    async jwt({ token, user, trigger }: { token: any; user: any; trigger?: string }) {
      if (user) {
        token.id = user.id
        // Regenerate session on sign in
        if (trigger === 'signIn') {
          token.iat = Math.floor(Date.now() / 1000)
          const crypto = await import('crypto')
          token.jti = crypto.randomBytes(16).toString('hex')
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
