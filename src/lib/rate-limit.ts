import { NextRequest, NextResponse } from 'next/server'

const rateLimitMap = new Map<string, { count: number; timestamp: number }>()

export function rateLimit(request: NextRequest, maxRequests = 10, windowMs = 60000) {
  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown'
  const now = Date.now()
  const windowStart = now - windowMs
  
  const record = rateLimitMap.get(ip)
  
  if (!record || record.timestamp < windowStart) {
    rateLimitMap.set(ip, { count: 1, timestamp: now })
    return { success: true }
  }
  
  if (record.count >= maxRequests) {
    return { 
      success: false, 
      error: 'Rate limit exceeded',
      statusCode: 429 
    }
  }
  
  record.count++
  return { success: true }
}

export function rateLimitMiddleware(
  request: NextRequest, 
  options: { maxRequests?: number; windowMs?: number } = {}
) {
  const { maxRequests = 10, windowMs = 60000 } = options
  return rateLimit(request, maxRequests, windowMs)
}