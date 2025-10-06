'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect } from 'react'
import AuthWrapper from '@/components/AuthWrapper'
import { Button } from '@/components/ui/button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  const { data: session } = useSession()

  // Log error for debugging
  useEffect(() => {
    console.error('Application Error:', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      user: session?.user?.email || 'anonymous',
      path: window.location.pathname
    })

    // In production, you'd send this to your error tracking service
    // Example: Sentry.captureException(error)
  }, [error, session])

  return (
    <AuthWrapper requireAuth={false}>
      <div className="min-h-screen bg-background text-foreground">
        {/* Navbar is rendered globally via RootLayout */}

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="text-center">
              {/* Error Illustration */}
              <div className="mb-8">
                <div className="mx-auto w-64 h-64 bg-muted rounded-full flex items-center justify-center">
                  <div className="text-6xl">⚠️</div>
                </div>
              </div>

              {/* Error Message */}
              <h1 className="text-4xl font-bold mb-4">
                Something went wrong
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                We encountered an unexpected error. Don't worry, our team has been notified and we're working to fix it.
              </p>

              {/* Error Details (only in development) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mb-8 max-w-4xl mx-auto">
                  <details className="bg-muted rounded-lg p-4 text-left">
                    <summary className="cursor-pointer font-medium mb-2">
                      Error Details (Development Only)
                    </summary>
                    <div className="text-sm text-muted-foreground">
                      <p><strong>Message:</strong> {error.message}</p>
                      {error.digest && <p><strong>Digest:</strong> {error.digest}</p>}
                      {error.stack && (
                        <div>
                          <strong>Stack Trace:</strong>
                          <pre className="mt-2 text-xs bg-card text-card-foreground p-2 rounded border overflow-auto">
                            {error.stack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Button onClick={reset} className="px-6 py-3">
                  🔄 Try Again
                </Button>
                
                <Button asChild className="px-6 py-3">
                  <Link href="/">🏠 Home Page</Link>
                </Button>

                {session && (
                  <Button asChild className="px-6 py-3">
                    <Link href="/dashboard">📊 Dashboard</Link>
                  </Button>
                )}
              </div>

              {/* Help Section */}
              <div className="bg-card rounded-lg shadow-sm border p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold mb-4">
                  Need Help?
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Try refreshing the page</p>
                  <p>• Check your internet connection</p>
                  <p>• Contact support if the problem persists</p>
                </div>
              </div>

              {/* Support Contact */}
              <div className="mt-8 text-sm text-muted-foreground">
                <p>If this error continues, please contact our support team.</p>
                <p>Error ID: {error.digest || 'N/A'}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthWrapper>
  )
}
