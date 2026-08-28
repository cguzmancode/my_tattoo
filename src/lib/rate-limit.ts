import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

// Fixed-window rate limiter backed by Postgres (table: rate_limits, created
// by prisma/rate-limit/01-init.sql). A single atomic upsert per request makes
// it safe across concurrent serverless instances — the reason the previous
// in-memory Map implementation could not work on Vercel.

export interface RateLimitOptions {
  maxRequests?: number
  windowMs?: number
}

export type RateLimitResult =
  | { success: true }
  | { success: false; error: string; statusCode: number }

export function clientIpFrom(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for')
  const realIp = headers.get('x-real-ip')
  return (forwardedFor?.split(',')[0] ?? realIp ?? 'unknown').trim()
}

export async function rateLimitByKey(
  key: string,
  options: RateLimitOptions = {}
): Promise<RateLimitResult> {
  const { maxRequests = 10, windowMs = 60000 } = options

  try {
    // Insert-or-increment in one statement; expired windows reset in place.
    const rows = await prisma.$queryRaw<Array<{ count: number }>>`
      INSERT INTO rate_limits (key, count, window_start)
      VALUES (${key}, 1, now())
      ON CONFLICT (key) DO UPDATE SET
        count = CASE
          WHEN rate_limits.window_start <= now() - (${windowMs}::int * interval '1 millisecond')
          THEN 1
          ELSE rate_limits.count + 1
        END,
        window_start = CASE
          WHEN rate_limits.window_start <= now() - (${windowMs}::int * interval '1 millisecond')
          THEN now()
          ELSE rate_limits.window_start
        END
      RETURNING count
    `

    const count = rows[0]?.count ?? 1
    if (count > maxRequests) {
      return { success: false, error: 'Rate limit exceeded', statusCode: 429 }
    }
    return { success: true }
  } catch (error) {
    // Fail open: a rate limiter outage must not take the booking form down.
    console.error('Rate limit check failed, allowing request:', error)
    return { success: true }
  }
}

export async function rateLimitMiddleware(
  request: NextRequest,
  options: RateLimitOptions = {}
): Promise<RateLimitResult> {
  const ip = clientIpFrom(request.headers)
  const route = new URL(request.url).pathname
  return rateLimitByKey(`${route}:${ip}`, options)
}
