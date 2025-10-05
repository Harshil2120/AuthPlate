'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AuthButton() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-4">
        <div className="animate-pulse bg-gray-300 h-8 w-20 rounded"></div>
      </div>
    )
  }

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">
            {session.user?.email}
          </span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => router.push('/auth/signin')}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
      >
        Sign in
      </button>
    </div>
  )
}
