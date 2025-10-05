import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
        error: 'No existing user found with this email' 
      }, { status: 404 })
    }

    // Check if the account is already linked
    const existingAccount = await accountsCollection.findOne({
      userId: existingUser._id,
      provider,
      providerAccountId
    })

    if (existingAccount) {
      return NextResponse.json({ 
        message: 'Account already linked',
        linked: true 
      })
    }

    // Link the account
    const accountData = {
      userId: existingUser._id,
      type: provider,
      provider,
      providerAccountId,
      access_token: null,
      refresh_token: null,
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
    logger.authEvent('Account linked', session.user.id, {
      userId: session.user.id,
      metadata: {
        email,
        provider,
        providerAccountId,
        linkedUserId: existingUser._id.toString()
      }
    })

    return NextResponse.json({ 
      message: 'Account successfully linked',
      linked: true 
    })

  } catch (error) {
    console.error('Account linking error:', error)
    logger.authEvent('Account linking error', null, {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db()
    const accountsCollection = db.collection('accounts')

    // Get all linked accounts for the current user
    const linkedAccounts = await accountsCollection.find({
      userId: session.user.id
    }).toArray()

    return NextResponse.json({ 
      accounts: linkedAccounts.map(account => ({
        id: account._id,
        provider: account.provider,
        type: account.type,
        createdAt: account.createdAt
      }))
    })

  } catch (error) {
    console.error('Get linked accounts error:', error)
    
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
