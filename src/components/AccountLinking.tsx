'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <button
          onClick={() => linkAccount('google')}
          disabled={isLinking}
          className="w-full bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
        >
          {isLinking ? 'Linking...' : 'Link Google Account'}
        </button>
        
        <button
          onClick={() => linkAccount('github')}
          disabled={isLinking}
          className="w-full bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
        >
          {isLinking ? 'Linking...' : 'Link GitHub Account'}
        </button>
      </div>
    </div>
  )
}
