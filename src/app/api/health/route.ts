import { NextRequest, NextResponse } from 'next/server'
import { applySecurityHeaders } from '@/lib/security'

export async function GET(request: NextRequest) {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV,
  }

  const response = NextResponse.json(healthCheck)
  return applySecurityHeaders(response)
}
