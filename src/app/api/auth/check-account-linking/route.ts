import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const { email, provider } = await request.json()

    if (!email) {
      return NextResponse.json({ 
        error: 'Email is required' 
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

    // Check what providers are already linked to this user
    const linkedAccounts = await accountsCollection.find({
      userId: existingUser._id
    }).toArray()

    const linkedProviders = linkedAccounts.map(account => account.provider)
    
    // Check if the current provider is already linked
    const isCurrentProviderLinked = linkedProviders.includes(provider)
    
    // Check if there are other providers linked
    const otherProviders = linkedProviders.filter(p => p !== provider)

    return NextResponse.json({
      exists: true,
      userId: existingUser._id.toString(),
      email: existingUser.email,
      linkedProviders,
      isCurrentProviderLinked,
      otherProviders,
      canLink: !isCurrentProviderLinked,
      message: isCurrentProviderLinked 
        ? 'This provider is already linked to this account'
        : otherProviders.length > 0 
          ? 'Account exists with other providers. You can link this provider.'
          : 'Account exists but no providers are linked yet'
    })

  } catch (error) {
    console.error('Check account linking error:', error)
    
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

    // Check what providers are already linked to this user
    const linkedAccounts = await accountsCollection.find({
      userId: existingUser._id
    }).toArray()

    const linkedProviders = linkedAccounts.map(account => account.provider)
    
    // If provider is specified, check if it's already linked
    let isCurrentProviderLinked = false
    let otherProviders = linkedProviders
    
    if (provider) {
      isCurrentProviderLinked = linkedProviders.includes(provider)
      otherProviders = linkedProviders.filter(p => p !== provider)
    }

    return NextResponse.json({
      exists: true,
      userId: existingUser._id.toString(),
      email: existingUser.email,
      linkedProviders,
      isCurrentProviderLinked,
      otherProviders,
      canLink: provider ? !isCurrentProviderLinked : true,
      message: provider && isCurrentProviderLinked 
        ? 'This provider is already linked to this account'
        : otherProviders.length > 0 
          ? 'Account exists with other providers. You can link this provider.'
          : 'Account exists but no providers are linked yet'
    })

  } catch (error) {
    console.error('Check account linking error:', error)
    
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
