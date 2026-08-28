import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { prisma } from '@/lib/prisma'
import { rateLimitByKey } from '@/lib/rate-limit'

function uniqueKey() {
  return `test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

describe('Postgres rate limiter', () => {
  beforeAll(async () => {
    // The init script is idempotent; running it here makes the test
    // self-sufficient on a fresh dev database.
    const sql = readFileSync(
      path.resolve(process.cwd(), 'prisma/rate-limit/01-init.sql'),
      'utf-8'
    )
    const withoutComments = sql
      .split('\n')
      .filter((line) => !line.trim().startsWith('--'))
      .join('\n')
    for (const statement of withoutComments.split(';').map((s) => s.trim()).filter(Boolean)) {
      await prisma.$executeRawUnsafe(statement)
    }
  })

  it('allows requests under the limit', async () => {
    const key = uniqueKey()

    for (let i = 0; i < 3; i++) {
      const result = await rateLimitByKey(key, { maxRequests: 3, windowMs: 60000 })
      expect(result.success).toBe(true)
    }
  })

  it('blocks the request that exceeds the limit', async () => {
    const key = uniqueKey()

    for (let i = 0; i < 2; i++) {
      await rateLimitByKey(key, { maxRequests: 2, windowMs: 60000 })
    }
    const blocked = await rateLimitByKey(key, { maxRequests: 2, windowMs: 60000 })

    expect(blocked.success).toBe(false)
    if (!blocked.success) {
      expect(blocked.statusCode).toBe(429)
    }
  })

  it('resets the counter when the window expires', async () => {
    const key = uniqueKey()

    for (let i = 0; i < 2; i++) {
      await rateLimitByKey(key, { maxRequests: 2, windowMs: 60000 })
    }
    expect((await rateLimitByKey(key, { maxRequests: 2, windowMs: 60000 })).success).toBe(false)

    // Simulate window expiry deterministically instead of sleeping
    await prisma.$executeRaw`
      UPDATE rate_limits
      SET window_start = now() - interval '2 minutes'
      WHERE key = ${key}
    `

    const afterExpiry = await rateLimitByKey(key, { maxRequests: 2, windowMs: 60000 })
    expect(afterExpiry.success).toBe(true)
  })

  it('tracks different keys independently', async () => {
    const keyA = uniqueKey()
    const keyB = uniqueKey()

    await rateLimitByKey(keyA, { maxRequests: 1, windowMs: 60000 })
    const blockedA = await rateLimitByKey(keyA, { maxRequests: 1, windowMs: 60000 })
    const freshB = await rateLimitByKey(keyB, { maxRequests: 1, windowMs: 60000 })

    expect(blockedA.success).toBe(false)
    expect(freshB.success).toBe(true)
  })
})
