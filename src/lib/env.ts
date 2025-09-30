/**
 * Environment variables validation
 * Ensures all required environment variables are present and valid
 */

const requiredEnvVars = {
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  MONGODB_URI: process.env.MONGODB_URI,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
  EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT,
  EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
  EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
  EMAIL_FROM: process.env.EMAIL_FROM,
} as const

const optionalEnvVars = {
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const

export function validateEnvironment() {
  const missingVars: string[] = []
  const invalidVars: string[] = []

  // Check required variables
  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value || value.trim() === '') {
      missingVars.push(key)
    }
  })

  // Validate specific formats
  if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
    invalidVars.push('NEXTAUTH_SECRET (must be at least 32 characters)')
  }

  if (process.env.EMAIL_SERVER_PORT && isNaN(parseInt(process.env.EMAIL_SERVER_PORT))) {
    invalidVars.push('EMAIL_SERVER_PORT (must be a valid number)')
  }

  if (process.env.NEXTAUTH_URL && !process.env.NEXTAUTH_URL.startsWith('http')) {
    invalidVars.push('NEXTAUTH_URL (must be a valid URL)')
  }

  if (missingVars.length > 0 || invalidVars.length > 0) {
    const errors = []
    if (missingVars.length > 0) {
      errors.push(`Missing required environment variables: ${missingVars.join(', ')}`)
    }
    if (invalidVars.length > 0) {
      errors.push(`Invalid environment variables: ${invalidVars.join(', ')}`)
    }
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`)
  }

  return {
    ...requiredEnvVars,
    ...optionalEnvVars,
  }
}

// Validate environment on module load
if (typeof window === 'undefined') {
  try {
    validateEnvironment()
  } catch (error) {
    console.error('❌ Environment validation failed:', error)
    if (process.env.NODE_ENV === 'production') {
      process.exit(1)
    }
  }
}

export const env = validateEnvironment()
