'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import AuthButton from '@/components/AuthButton'
import AuthWrapper from '@/components/AuthWrapper'

export default function NotFound() {
  const { data: session } = useSession()
  const router = useRouter()

  // Log 404 errors for analytics
  useEffect(() => {
    // In a real app, you'd send this to your analytics service
    console.log('404 Error:', {
      path: window.location.pathname,
      timestamp: new Date().toISOString(),
      user: session?.user?.email || 'anonymous'
    })
  }, [session])

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
              {/* 404 Illustration */}
              <div className="mb-8">
                <div className="mx-auto w-64 h-64 bg-gray-100 rounded-full flex items-center justify-center">
                  <div className="text-6xl font-bold text-gray-400">404</div>
                </div>
              </div>

              {/* Error Message */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Page Not Found
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you might have typed the wrong URL.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <button
                  onClick={() => router.back()}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  ← Go Back
                </button>
                
                <Link
                  href="/"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
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

              {/* Helpful Links */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Popular Pages
                </h3>
                <div className="space-y-2">
                  <Link 
                    href="/" 
                    className="block text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    → Home
                  </Link>
                  {session ? (
                    <Link 
                      href="/dashboard" 
                      className="block text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      → Dashboard
                    </Link>
                  ) : (
                    <Link 
                      href="/auth/signin" 
                      className="block text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      → Sign In
                    </Link>
                  )}
                </div>
              </div>

              {/* Search Suggestion */}
              <div className="mt-8 text-sm text-gray-500">
                <p>Can't find what you're looking for?</p>
                <p>Try checking the URL for typos or contact support if you believe this is an error.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthWrapper>
  )
}
