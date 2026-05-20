import 'dotenv/config'
import { describe, it, expect, afterAll } from 'vitest'
import { prisma } from '@/lib/prisma'
import { seedDemo } from '../../../prisma/seed'

if (process.env.INTEGRATION_TEST !== '1') {
  throw new Error(
    'seed-demo.test.ts writes/deletes artist rows — refuse to run without INTEGRATION_TEST=1. Use `pnpm test:integration` (not `vitest run` directly).',
  )
}

const FIXED_TODAY = new Date('2026-05-20T12:00:00Z')

function uniqueClerkId() {
  return `test_seed_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function uniqueSlug(clerkId: string) {
  return `slug-${clerkId.slice(-12)}`
}

describe('seedDemo', () => {
  const createdClerkIds: string[] = []

  afterAll(async () => {
    if (createdClerkIds.length > 0) {
      await prisma.artist.deleteMany({ where: { clerkId: { in: createdClerkIds } } })
    }
    await prisma.$disconnect()
  })

  it('creates exactly one artist with the given clerkId', async () => {
    const clerkId = uniqueClerkId()
    createdClerkIds.push(clerkId)

    const result = await seedDemo({ clerkId, slug: uniqueSlug(clerkId), today: FIXED_TODAY })

    expect(result.artist.clerkId).toBe(clerkId)

    const count = await prisma.artist.count({ where: { clerkId } })
    expect(count).toBe(1)
  })

  it('creates bookings covering PENDING, ACCEPTED, CONFIRMED and COMPLETED statuses', async () => {
    const clerkId = uniqueClerkId()
    createdClerkIds.push(clerkId)

    await seedDemo({ clerkId, slug: uniqueSlug(clerkId), today: FIXED_TODAY })
    const artist = await prisma.artist.findUniqueOrThrow({ where: { clerkId } })
    const bookings = await prisma.booking.findMany({ where: { artistId: artist.id } })

    const statuses = new Set(bookings.map((b) => b.status))
    expect(statuses.has('PENDING')).toBe(true)
    expect(statuses.has('ACCEPTED')).toBe(true)
    expect(statuses.has('CONFIRMED')).toBe(true)
    expect(statuses.has('COMPLETED')).toBe(true)
  })

  it('creates at least one blocked date in the future relative to today', async () => {
    const clerkId = uniqueClerkId()
    createdClerkIds.push(clerkId)

    await seedDemo({ clerkId, slug: uniqueSlug(clerkId), today: FIXED_TODAY })
    const artist = await prisma.artist.findUniqueOrThrow({ where: { clerkId } })
    const blockedDates = await prisma.blockedDate.findMany({ where: { artistId: artist.id } })

    const future = blockedDates.filter((b) => b.date > FIXED_TODAY)
    expect(future.length).toBeGreaterThan(0)
  })

  it('creates booking messages for at least one booking', async () => {
    const clerkId = uniqueClerkId()
    createdClerkIds.push(clerkId)

    await seedDemo({ clerkId, slug: uniqueSlug(clerkId), today: FIXED_TODAY })
    const artist = await prisma.artist.findUniqueOrThrow({ where: { clerkId } })

    const messages = await prisma.bookingMessage.findMany({
      where: { booking: { artistId: artist.id } },
    })
    expect(messages.length).toBeGreaterThan(0)
  })

  it('is idempotent: running twice yields the same counts', async () => {
    const clerkId = uniqueClerkId()
    createdClerkIds.push(clerkId)
    const slug = uniqueSlug(clerkId)

    await seedDemo({ clerkId, slug, today: FIXED_TODAY })
    const artist1 = await prisma.artist.findUniqueOrThrow({ where: { clerkId } })
    const bookingCount1 = await prisma.booking.count({ where: { artistId: artist1.id } })
    const blockedCount1 = await prisma.blockedDate.count({ where: { artistId: artist1.id } })

    await seedDemo({ clerkId, slug, today: FIXED_TODAY })
    const artist2 = await prisma.artist.findUniqueOrThrow({ where: { clerkId } })
    const bookingCount2 = await prisma.booking.count({ where: { artistId: artist2.id } })
    const blockedCount2 = await prisma.blockedDate.count({ where: { artistId: artist2.id } })

    expect(bookingCount2).toBe(bookingCount1)
    expect(blockedCount2).toBe(blockedCount1)
  })
})
