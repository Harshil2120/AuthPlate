'use client'

import { useSession, signOut } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export default function AuthButton() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-8 w-24" />
      </div>
    )
  }

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-muted-foreground">
            {session.user?.email}
          </span>
        </div>
        <Button variant="destructive" onClick={() => signOut({ callbackUrl: '/' })}>
          Sign out
        </Button>
      </div>
    )
  }

  return (
    pathname?.startsWith('/auth/signin') ? null : (
      <div className="flex items-center space-x-4">
        <Button onClick={() => router.push('/auth/signin')}>Sign in</Button>
      </div>
    )
  )
}
