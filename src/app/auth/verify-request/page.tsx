'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function VerifyRequestForm() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-green-600">
            <svg
              className="h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">
            Check your email
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            We&apos;ve sent a magic link to{' '}
            <span className="font-medium text-primary">{email}</span>
          </p>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Click the link in the email to sign in. The link will expire in 24 hours.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function VerifyRequest() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyRequestForm />
    </Suspense>
  )
}
