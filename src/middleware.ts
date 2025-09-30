import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { logger } from '@/lib/logger'
import { env } from '@/lib/env'

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Rate limiting configuration
const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // limit each IP to 100 requests per windowMs
  authMaxRequests: 100, // limit auth endpoints to 100 requests per windowMs (increased for better UX)
}

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  return ip
}

function isRateLimited(request: NextRequest, maxRequests: number): boolean {
  const key = getRateLimitKey(request)
  const now = Date.now()
  const windowMs = RATE_LIMIT.windowMs

  const current = rateLimitStore.get(key)
  
  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return false
  }

  if (current.count >= maxRequests) {
    return true
  }

  current.count++
  return false
}

// Security headers middleware
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Remove server information
  response.headers.delete('x-powered-by')
  
  // Add additional security headers
  response.headers.set('X-DNS-Prefetch-Control', 'off')
  response.headers.set('X-Download-Options', 'noopen')
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none')
  
  // Content Security Policy - more permissive for development
  const csp = env.NODE_ENV === 'development' 
    ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
    : "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
  
  response.headers.set('Content-Security-Policy', csp)

  return response
}

// Authentication route protection
async function handleAuthProtection(request: NextRequest) {
  const url = new URL(request.url)
  const pathname = url.pathname
  
  // Define protected routes (require authentication)
  const protectedRoutes = ['/dashboard']
  
  // Define auth routes (redirect if already authenticated)
  const authRoutes = ['/auth/signin', '/auth/signup']
  
  // Define routes that should redirect authenticated users to dashboard
  const redirectAuthenticatedRoutes = ['/']
  
  // Check if current path is protected, auth route, or redirect route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
  const isRedirectRoute = redirectAuthenticatedRoutes.some(route => pathname === route)
  
  if (isProtectedRoute || isAuthRoute || isRedirectRoute) {
    const token = await getToken({ req: request, secret: env.NEXTAUTH_SECRET })
    const isAuthenticated = !!token
    
    // Redirect unauthenticated users from protected routes to signin
    if (isProtectedRoute && !isAuthenticated) {
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }
    
    // Redirect authenticated users from auth routes to dashboard
    if (isAuthRoute && isAuthenticated) {
      const callbackUrl = request.nextUrl.searchParams.get('callbackUrl') || '/dashboard'
      return NextResponse.redirect(new URL(callbackUrl, request.url))
    }
    
    // Redirect authenticated users from redirect routes (like home) to dashboard
    if (isRedirectRoute && isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }
  
  return null
}

// Handle 404 logging and analytics
function log404Request(request: NextRequest) {
  const url = new URL(request.url)
  const pathname = url.pathname
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const referer = request.headers.get('referer') || 'direct'
  
  // Log 404 for analytics (in production, send to your analytics service)
  logger.warn(`404 Error: ${pathname}`, {
    userAgent,
    ip: getRateLimitKey(request),
    metadata: {
      referer,
      pathname,
      method: request.method
    }
  })
}

// Main middleware function
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Log all requests for debugging (in development)
  if (env.NODE_ENV === 'development') {
    // Better pathname extraction
    const url = new URL(request.url)
    const safePathname = url.pathname || pathname || '/'
    logger.info(`Middleware processing: ${request.method} ${safePathname}`)
  }

  // Handle authentication protection first
  const authResponse = await handleAuthProtection(request)
  if (authResponse) {
    return addSecurityHeaders(authResponse)
  }

  // Skip rate limiting for NextAuth internal endpoints
  const skipRateLimit = [
    '/api/auth/session',
    '/api/auth/_log',
    '/api/auth/csrf',
    '/api/auth/providers',
    '/api/auth/signin',
    '/api/auth/callback',
    '/api/auth/signout'
  ].some(endpoint => pathname.startsWith(endpoint))

  if (skipRateLimit) {
    const response = NextResponse.next()
    return addSecurityHeaders(response)
  }

  // Apply rate limiting
  const isAuthEndpoint = pathname.startsWith('/api/auth/')
  const maxRequests = isAuthEndpoint ? RATE_LIMIT.authMaxRequests : RATE_LIMIT.maxRequests
  
  if (isRateLimited(request, maxRequests)) {
    const ip = getRateLimitKey(request)
    logger.rateLimitEvent(ip, pathname)
    
    return new NextResponse('Too Many Requests', { 
      status: 429,
      headers: {
        'Retry-After': '900', // 15 minutes
      }
    })
  }

  // Security headers for all responses
  const response = NextResponse.next()
  return addSecurityHeaders(response)
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}

