'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect } from 'react'
import AuthButton from '@/components/AuthButton'
import AuthWrapper from '@/components/AuthWrapper'

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
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                  Your App
                </Link>
              </div>
              <div className="flex items-center">
                <AuthButton />
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="text-center">
              {/* Error Illustration */}
              <div className="mb-8">
                <div className="mx-auto w-64 h-64 bg-red-50 rounded-full flex items-center justify-center">
                  <div className="text-6xl">⚠️</div>
                </div>
              </div>

              {/* Error Message */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Something went wrong
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                We encountered an unexpected error. Don't worry, our team has been notified and we're working to fix it.
              </p>

              {/* Error Details (only in development) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mb-8 max-w-4xl mx-auto">
                  <details className="bg-gray-100 rounded-lg p-4 text-left">
                    <summary className="cursor-pointer font-medium text-gray-900 mb-2">
                      Error Details (Development Only)
                    </summary>
                    <div className="text-sm text-gray-700">
                      <p><strong>Message:</strong> {error.message}</p>
                      {error.digest && <p><strong>Digest:</strong> {error.digest}</p>}
                      {error.stack && (
                        <div>
                          <strong>Stack Trace:</strong>
                          <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto">
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
                <button
                  onClick={reset}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  🔄 Try Again
                </button>
                
                <Link
                  href="/"
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  🏠 Home Page
                </Link>

                {session && (
                  <Link
                    href="/dashboard"
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    📊 Dashboard
                  </Link>
                )}
              </div>

              {/* Help Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Need Help?
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Try refreshing the page</p>
                  <p>• Check your internet connection</p>
                  <p>• Contact support if the problem persists</p>
                </div>
              </div>

              {/* Support Contact */}
              <div className="mt-8 text-sm text-gray-500">
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
