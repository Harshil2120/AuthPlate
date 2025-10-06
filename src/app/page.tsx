'use client'

import { useSession } from 'next-auth/react'
import Spinner from '@/components/Spinner'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  const { status } = useSession()

  // Show loading state while checking authentication
  if (status === 'loading') {
    return <Spinner />
  }

  // This page only shows for unauthenticated users
  // Authenticated users are redirected to dashboard by middleware
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar is rendered globally via RootLayout */}

      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Next.js Authentication
              <span className="block text-primary">Starter Template</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              AuthPlate is a complete starter template for building Next.js applications with authentication. Get started quickly with MongoDB integration, JWT tokens, and security features built-in.
            </p>
            <div className="flex justify-center">
              <Button asChild size="lg">
                <Link href="/auth/signin">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to get started
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A complete starter template with modern technologies and best practices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/15 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Ready to Use</h3>
              <p className="text-muted-foreground">
                JWT tokens, password hashing, CSRF protection, and session management built-in so you can focus on building your application.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/15 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">MongoDB Integration</h3>
              <p className="text-muted-foreground">
                Seamless integration with MongoDB for user data storage, session management, and scalable user authentication.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/15 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Next.js Optimized</h3>
              <p className="text-muted-foreground">
                Built specifically for Next.js with App Router support, middleware integration, and server-side rendering compatibility.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-card p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/15 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">TypeScript Ready</h3>
              <p className="text-muted-foreground">
                Full TypeScript support with type-safe authentication, user sessions, and database operations for better developer experience.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-card p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/15 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Mobile Responsive</h3>
              <p className="text-muted-foreground">
                Beautiful, responsive authentication pages that work perfectly on desktop, tablet, and mobile devices.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-card p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/15 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Quick Start</h3>
              <p className="text-muted-foreground">
                Clone, configure, and start building. This starter template gets you up and running with authentication in minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to start building?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Use this starter template as your foundation for building secure Next.js applications.
          </p>
          <div className="flex justify-center">
            <Button asChild size="lg" className="bg-white text-indigo-600">
              <Link href="/auth/signin">Start Building Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer is now rendered globally via RootLayout */}
    </div>
  )
}