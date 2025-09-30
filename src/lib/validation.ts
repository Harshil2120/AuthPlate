/**
 * Input validation and sanitization utilities
 */

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

// URL validation regex
const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  sanitizedValue?: string
}

/**
 * Validates and sanitizes email input
 */
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = []
  
  if (!email || typeof email !== 'string') {
    errors.push('Email is required')
    return { isValid: false, errors }
  }

  const trimmedEmail = email.trim().toLowerCase()
  
  if (trimmedEmail.length === 0) {
    errors.push('Email cannot be empty')
    return { isValid: false, errors }
  }

  if (trimmedEmail.length > 254) {
    errors.push('Email is too long (max 254 characters)')
    return { isValid: false, errors }
  }

  if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.push('Invalid email format')
    return { isValid: false, errors }
  }

  return {
    isValid: true,
    errors: [],
    sanitizedValue: trimmedEmail
  }
}

/**
 * Validates and sanitizes URL input
 */
export function validateUrl(url: string): ValidationResult {
  const errors: string[] = []
  
  if (!url || typeof url !== 'string') {
    errors.push('URL is required')
    return { isValid: false, errors }
  }

  const trimmedUrl = url.trim()
  
  if (trimmedUrl.length === 0) {
    errors.push('URL cannot be empty')
    return { isValid: false, errors }
  }

  if (trimmedUrl.length > 2048) {
    errors.push('URL is too long (max 2048 characters)')
    return { isValid: false, errors }
  }

  if (!URL_REGEX.test(trimmedUrl)) {
    errors.push('Invalid URL format')
    return { isValid: false, errors }
  }

  return {
    isValid: true,
    errors: [],
    sanitizedValue: trimmedUrl
  }
}

/**
 * Sanitizes string input to prevent XSS
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000) // Limit length
}

/**
 * Validates callback URL for security
 */
export function validateCallbackUrl(url: string, baseUrl: string): ValidationResult {
  const errors: string[] = []
  
  if (!url) {
    return { isValid: true, errors: [], sanitizedValue: baseUrl }
  }

  // Allow relative URLs
  if (url.startsWith('/')) {
    return { isValid: true, errors: [], sanitizedValue: url }
  }

  // Validate absolute URLs
  const urlValidation = validateUrl(url)
  if (!urlValidation.isValid) {
    errors.push(...urlValidation.errors)
    return { isValid: false, errors }
  }

  // Ensure URL is from the same origin
  try {
    const urlObj = new URL(url)
    const baseUrlObj = new URL(baseUrl)
    
    if (urlObj.origin !== baseUrlObj.origin) {
      errors.push('Callback URL must be from the same origin')
      return { isValid: false, errors }
    }
  } catch {
    errors.push('Invalid URL format')
    return { isValid: false, errors }
  }

  return {
    isValid: true,
    errors: [],
    sanitizedValue: url
  }
}

/**
 * Validates password strength (if implementing password auth)
 */
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = []
  
  if (!password || typeof password !== 'string') {
    errors.push('Password is required')
    return { isValid: false, errors }
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }

  if (password.length > 128) {
    errors.push('Password is too long (max 128 characters)')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (!/[^a-zA-Z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: password
  }
}
