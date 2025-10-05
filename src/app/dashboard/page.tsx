'use client'

import { useSession } from 'next-auth/react'
import AuthButton from '@/components/AuthButton'
import AuthWrapper from '@/components/AuthWrapper'

export default function Dashboard() {
  const { data: session } = useSession()

  return (
    <AuthWrapper requireAuth={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  Dashboard
                </h1>
              </div>
              <div className="flex items-center">
                <AuthButton />
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Protected Dashboard
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    User Information
                  </h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <p><strong>Email:</strong> {session?.user?.email}</p>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    Authentication Status
                  </h3>
                  <div className="space-y-2 text-sm text-green-800">
                    <p><strong>Status:</strong> Authenticated</p>
                    <p><strong>Session ID:</strong> ***{session?.user && 'id' in session.user ? String(session.user.id).slice(-4) : '****'}</p>
                    <p><strong>Provider:</strong> JWT Token</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Security Information
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Session Status:</strong> Active and Secure</p>
                  <p><strong>Authentication Method:</strong> OAuth + Magic Link</p>
                  <p><strong>Session Expires:</strong> 30 days from login</p>
                  <p><strong>Security Level:</strong> High (JWT + Secure Cookies)</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthWrapper>
  )
}
