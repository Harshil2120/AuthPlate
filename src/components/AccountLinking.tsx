'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface AccountLinkingProps {
  onLinkSuccess?: () => void
  onLinkError?: (error: string) => void
}

export default function AccountLinking({ onLinkSuccess, onLinkError }: AccountLinkingProps) {
  const { data: session, update } = useSession()
  const [isLinking, setIsLinking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const linkAccount = async (provider: string) => {
    if (!session?.user?.email) {
      setError('No user email found')
      return
    }

    setIsLinking(true)
    setError(null)

    try {
      // Check if account can be linked
      const checkResponse = await fetch('/api/auth/check-account-linking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,
          provider
        })
      })

      const checkData = await checkResponse.json()

      if (!checkData.exists) {
        setError('No existing account found with this email')
        return
      }

      if (checkData.isCurrentProviderLinked) {
        setError('This provider is already linked to your account')
        return
      }

      if (!checkData.canLink) {
        setError('Cannot link this provider')
        return
      }

      // Link the account
      const linkResponse = await fetch('/api/auth/account-linking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,
          provider,
          providerAccountId: 'pending' // This would be handled by the OAuth flow
        })
      })

      const linkData = await linkResponse.json()

      if (linkResponse.ok) {
        onLinkSuccess?.()
        // Update the session to reflect the new linked account
        await update()
      } else {
        setError(linkData.error || 'Failed to link account')
        onLinkError?.(linkData.error || 'Failed to link account')
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      onLinkError?.(errorMessage)
    } finally {
      setIsLinking(false)
    }
  }

  const getLinkedAccounts = async () => {
    try {
      const response = await fetch('/api/auth/account-linking')
      const data = await response.json()
      return data.accounts || []
    } catch (err) {
      console.error('Failed to get linked accounts:', err)
      return []
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Account Linking</h3>
      
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Button onClick={() => linkAccount('google')} disabled={isLinking} className="w-full">
          {isLinking ? 'Linking...' : 'Link Google Account'}
        </Button>
        
        <Button onClick={() => linkAccount('github')} disabled={isLinking} className="w-full">
          {isLinking ? 'Linking...' : 'Link GitHub Account'}
        </Button>
      </div>
    </div>
  )
}
