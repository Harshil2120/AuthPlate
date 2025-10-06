'use client'

import { useSession } from 'next-auth/react'
import AuthWrapper from '@/components/AuthWrapper'

export default function Dashboard() {
  const { data: session } = useSession()

  return (
    <AuthWrapper requireAuth={true}>
      <div className="min-h-screen bg-background text-foreground">
      {/* Navbar is rendered globally via RootLayout */}

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-card border shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">
                Protected Dashboard
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-muted border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    User Information
                  </h3>
                  <div className="space-y-2 text-sm text-foreground/80">
                    <p><strong>Email:</strong> {session?.user?.email}</p>
                  </div>
                </div>
                
                <div className="bg-muted border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Authentication Status
                  </h3>
                  <div className="space-y-2 text-sm text-foreground/80">
                    <p><strong>Status:</strong> Authenticated</p>
                    <p><strong>Session ID:</strong> ***{session?.user && 'id' in session.user ? String(session.user.id).slice(-4) : '****'}</p>
                    <p><strong>Provider:</strong> JWT Token</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-muted border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">
                  Security Information
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
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
