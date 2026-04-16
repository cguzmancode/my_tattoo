import 'dotenv/config'
import { describe, it, expect } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined')
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

describe('Database Connection', () => {
  it('should connect to database', async () => {
    const result = await prisma.$queryRaw`SELECT 1 as test`

    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
    expect((result as { test: number }[])[0].test).toBe(1)
  })

  it('should have DATABASE_URL configured', () => {
    expect(process.env.DATABASE_URL).toBeDefined()
    expect(process.env.DATABASE_URL).toContain('postgresql://')
  })

  it('should have DIRECT_URL configured', () => {
    expect(process.env.DIRECT_URL).toBeDefined()
    expect(process.env.DIRECT_URL).toContain('postgresql://')
  })

  it('should have Supabase URL configured', () => {
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined()
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toContain('supabase.co')
  })
})
