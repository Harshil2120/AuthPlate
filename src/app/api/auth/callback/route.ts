import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const { email, provider, providerAccountId, accessToken, refreshToken } = await request.json()

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
        error: 'No existing user found with this email',
        shouldCreateUser: true
      }, { status: 404 })
    }

    // Check if this provider account is already linked
    const existingAccount = await accountsCollection.findOne({
      userId: existingUser._id,
      provider,
      providerAccountId
    })

    if (existingAccount) {
      return NextResponse.json({ 
        message: 'Account already linked',
        linked: true,
        userId: existingUser._id.toString()
      })
    }

    // Check if this provider account is linked to a different user
    const conflictingAccount = await accountsCollection.findOne({
      provider,
      providerAccountId
    })

    if (conflictingAccount && conflictingAccount.userId.toString() !== existingUser._id.toString()) {
      return NextResponse.json({
        error: 'This provider account is already linked to a different user',
        conflict: true,
        existingUserId: conflictingAccount.userId.toString()
      }, { status: 409 })
    }

    // Link the account to the existing user
    const accountData = {
      userId: existingUser._id,
      type: provider,
      provider,
      providerAccountId,
      access_token: accessToken || null,
      refresh_token: refreshToken || null,
      expires_at: null,
      token_type: null,
      scope: null,
      id_token: null,
      session_state: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await accountsCollection.insertOne(accountData)

    // Log the account linking event
    logger.authEvent('Account linked via callback', existingUser._id.toString(), {
      userId: existingUser._id.toString(),
      metadata: {
        email,
        provider,
        providerAccountId
      }
    })

    return NextResponse.json({ 
      message: 'Account successfully linked',
      linked: true,
      userId: existingUser._id.toString()
    })

  } catch (error) {
    console.error('Callback linking error:', error)
    logger.authEvent('Callback linking error', undefined, {
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
        exists: false,
        message: 'No existing user found with this email'
      })
    }

    // Get linked accounts for this user
    const linkedAccounts = await accountsCollection.find({
      userId: existingUser._id
    }).toArray()

    const linkedProviders = linkedAccounts.map(account => account.provider)
    const isCurrentProviderLinked = provider ? linkedProviders.includes(provider) : false

    return NextResponse.json({
      exists: true,
      userId: existingUser._id.toString(),
      email: existingUser.email,
      linkedProviders,
      isCurrentProviderLinked,
      canLink: provider ? !isCurrentProviderLinked : true,
      message: isCurrentProviderLinked 
        ? 'This provider is already linked to this account'
        : 'Account exists and can be linked'
    })

  } catch (error) {
    console.error('Callback check error:', error)
    
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
