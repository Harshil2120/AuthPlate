'use client'

import { signIn, getProviders } from 'next-auth/react'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { validateEmail, validateCallbackUrl } from '@/lib/validation'
import { logger } from '@/lib/logger'

function SignInForm() {
  const [providers, setProviders] = useState<Record<string, { id: string; name: string }> | null>(null)
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    fetchProviders()
  }, [])

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Validate email input
    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      alert(`Invalid email: ${emailValidation.errors.join(', ')}`)
      setIsLoading(false)
      return
    }
    
    // Validate callback URL
    const urlValidation = validateCallbackUrl(callbackUrl, window.location.origin)
    if (!urlValidation.isValid) {
      alert(`Invalid callback URL: ${urlValidation.errors.join(', ')}`)
      setIsLoading(false)
      return
    }
    
    try {
      await signIn('email', { 
        email: emailValidation.sanitizedValue, 
        callbackUrl: urlValidation.sanitizedValue 
      })
    } catch (error) {
      logger.error('Sign in error', {
        metadata: {
          email: emailValidation.sanitizedValue,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      })
      alert('Sign in failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          {/* OAuth Providers */}
          <div className="space-y-3">
            {providers &&
              Object.values(providers)
                .filter((provider: { id: string }) => provider.id !== 'email')
                .map((provider: { id: string; name: string }) => (
                  <button
                    key={provider.name}
                    onClick={() => signIn(provider.id, { callbackUrl })}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Sign in with {provider.name}
                  </button>
                ))}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Email Sign In */}
          <form className="space-y-6" onSubmit={handleEmailSignIn}>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? 'Sending magic link...' : 'Send magic link'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function SignIn() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInForm />
    </Suspense>
  )
}
