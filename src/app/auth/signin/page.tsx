'use client'

import { signIn, getProviders } from 'next-auth/react'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { validateEmail, validateCallbackUrl } from '@/lib/validation'
import { logger } from '@/lib/logger'
import { Button } from '@/components/ui/button'
import { Wand } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 640"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M564 325.8C564 467.3 467.1 568 324 568C186.8 568 76 457.2 76 320C76 182.8 186.8 72 324 72C390.8 72 447 96.5 490.3 136.9L422.8 201.8C334.5 116.6 170.3 180.6 170.3 320C170.3 406.5 239.4 476.6 324 476.6C422.2 476.6 459 406.2 464.8 369.7L324 369.7L324 284.4L560.1 284.4C562.4 297.1 564 309.3 564 325.8z"/>
    </svg>
  )
}

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
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Sign in</CardTitle>
          <CardDescription>Choose a provider or use your email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* OAuth Providers */}
          <div className="space-y-3">
            {providers &&
              Object.values(providers)
                .filter((provider: { id: string }) => provider.id !== 'email')
                .map((provider: { id: string; name: string }) => (
                  <Button key={provider.name} className="w-full gap-2" onClick={() => signIn(provider.id, { callbackUrl })}>
                    {provider.id === 'google' ? <GoogleIcon className="h-4 w-4" /> : null}
                    <span>Sign in with {provider.name}</span>
                  </Button>
                ))}
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Email Sign In */}
          <form className="space-y-4" onSubmit={handleEmailSignIn}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full gap-2">
              <Wand className="h-6 w-6" />
              {isLoading ? 'Sending magic link...' : 'Send magic link'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center text-xs text-muted-foreground">
          By continuing, you agree to our terms and privacy policy.
        </CardFooter>
      </Card>
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
