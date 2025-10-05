import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const { email, provider, providerAccountId } = await request.json()

    if (!email || !provider || !providerAccountId) {
      return NextResponse.json({ 
        error: 'Missing required fields: email, provider, providerAccountId' 
      }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()
    const usersCollection = db.collection('users')
    const accountsCollection = db.collection('accounts')

    // Check if there's an existing user with this email
    const existingUser = await usersCollection.findOne({ email })
    
    if (!existingUser) {
      return NextResponse.json({ 
        conflict: false,
        message: 'No existing user found with this email'
      })
    }

    // Check if this specific provider account is already linked to a different user
    const existingAccount = await accountsCollection.findOne({
      provider,
      providerAccountId
    })

    if (existingAccount && existingAccount.userId.toString() !== existingUser._id.toString()) {
      // This provider account is linked to a different user
      return NextResponse.json({
        conflict: true,
        conflictType: 'provider_account_linked_to_different_user',
        message: 'This provider account is already linked to a different user',
        existingUserId: existingAccount.userId.toString(),
        targetUserId: existingUser._id.toString()
      })
    }

    // Check what providers are already linked to the existing user
    const linkedAccounts = await accountsCollection.find({
      userId: existingUser._id
    }).toArray()

    const linkedProviders = linkedAccounts.map(account => account.provider)
    const isCurrentProviderLinked = linkedProviders.includes(provider)

    if (isCurrentProviderLinked) {
      return NextResponse.json({
        conflict: false,
        alreadyLinked: true,
        message: 'This provider is already linked to this account',
        linkedProviders
      })
    }

    // Check if there are other providers linked
    const otherProviders = linkedProviders.filter(p => p !== provider)

    return NextResponse.json({
      conflict: false,
      canLink: true,
      existingUser: {
        id: existingUser._id.toString(),
        email: existingUser.email,
      },
      linkedProviders,
      otherProviders,
      message: otherProviders.length > 0 
        ? 'Account exists with other providers. You can link this provider.'
        : 'Account exists but no providers are linked yet'
    })

  } catch (error) {
    console.error('Check conflict error:', error)
    logger.authEvent('Check conflict error', null, {
      metadata: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    })
    
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const provider = searchParams.get('provider')
    const providerAccountId = searchParams.get('providerAccountId')

    if (!email) {
      return NextResponse.json({ 
        error: 'Email parameter is required' 
      }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()
    const usersCollection = db.collection('users')
    const accountsCollection = db.collection('accounts')

    // Check if there's an existing user with this email
    const existingUser = await usersCollection.findOne({ email })
    
    if (!existingUser) {
      return NextResponse.json({ 
        conflict: false,
        message: 'No existing user found with this email'
      })
    }

    // If provider and providerAccountId are provided, check for conflicts
    if (provider && providerAccountId) {
      const existingAccount = await accountsCollection.findOne({
        provider,
        providerAccountId
      })

      if (existingAccount && existingAccount.userId.toString() !== existingUser._id.toString()) {
        return NextResponse.json({
          conflict: true,
          conflictType: 'provider_account_linked_to_different_user',
          message: 'This provider account is already linked to a different user',
          existingUserId: existingAccount.userId.toString(),
          targetUserId: existingUser._id.toString()
        })
      }
    }

    // Check what providers are already linked to the existing user
    const linkedAccounts = await accountsCollection.find({
      userId: existingUser._id
    }).toArray()

    const linkedProviders = linkedAccounts.map(account => account.provider)
    const isCurrentProviderLinked = provider ? linkedProviders.includes(provider) : false
    const otherProviders = provider ? linkedProviders.filter(p => p !== provider) : linkedProviders

    return NextResponse.json({
      conflict: false,
      canLink: provider ? !isCurrentProviderLinked : true,
      existingUser: {
        id: existingUser._id.toString(),
        email: existingUser.email,
      },
      linkedProviders,
      otherProviders,
      isCurrentProviderLinked,
      message: isCurrentProviderLinked 
        ? 'This provider is already linked to this account'
        : otherProviders.length > 0 
          ? 'Account exists with other providers. You can link this provider.'
          : 'Account exists but no providers are linked yet'
    })

  } catch (error) {
    console.error('Check conflict error:', error)
    
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
