'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import Spinner from './Spinner'

interface AuthWrapperProps {
  children: ReactNode
  requireAuth?: boolean
  redirectTo?: string
  fallback?: ReactNode
}

/**
 * AuthWrapper - A reusable component for handling authentication logic
 * 
 * @param requireAuth - If true, redirects unauthenticated users to signin
 * @param redirectTo - Where to redirect unauthenticated users (default: '/auth/signin')
 * @param fallback - What to show while loading (default: Spinner)
 */
export default function AuthWrapper({ 
  children, 
  requireAuth = false, 
  redirectTo = '/auth/signin',
  fallback = <Spinner />
}: AuthWrapperProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated' && requireAuth) {
      router.push(redirectTo)
    }
  }, [status, requireAuth, redirectTo, router])

  // Show loading state
  if (status === 'loading') {
    return <>{fallback}</>
  }

  // Don't render children if authentication is required but user is not authenticated
  if (requireAuth && !session) {
    return null
  }

  return <>{children}</>
}

/**
 * Higher-order component for protecting pages
 */
export function withAuth<T extends object>(Component: React.ComponentType<T>, options?: {
  redirectTo?: string
  fallback?: ReactNode
}) {
  return function AuthenticatedComponent(props: T) {
    return (
      <AuthWrapper 
        requireAuth={true} 
        redirectTo={options?.redirectTo}
        fallback={options?.fallback}
      >
        <Component {...props} />
      </AuthWrapper>
    )
  }
}

/**
 * Higher-order component for auth pages (redirect if already authenticated)
 */
export function withAuthRedirect<T extends object>(Component: React.ComponentType<T>, options?: {
  redirectTo?: string
  fallback?: ReactNode
}) {
  return function AuthRedirectComponent(props: T) {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
      if (status === 'authenticated' && session) {
        const redirectTo = options?.redirectTo || '/dashboard'
        router.replace(redirectTo)
      }
    }, [status, session, router, options?.redirectTo])

    if (status === 'loading') {
      return <>{options?.fallback || <Spinner />}</>
    }

    if (status === 'authenticated') {
      return null
    }

    return <Component {...props} />
  }
}
