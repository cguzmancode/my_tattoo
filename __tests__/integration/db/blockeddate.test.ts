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

function generateUniqueId() {
  return `test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

describe('BlockedDate Model', () => {
  it('should block a date for artist', async () => {
    const uniqueId = generateUniqueId()

    const artist = await prisma.artist.create({
      data: {
        clerkId: `artist_${uniqueId}`,
        email: `artist_${uniqueId}@test.com`,
        name: 'Test Artist',
        slug: `artist-slug-${uniqueId}`,
      },
    })

    const blocked = await prisma.blockedDate.create({
      data: {
        artistId: artist.id,
        date: new Date('2026-05-15'),
        reason: 'Vacation',
      },
    })

    expect(blocked).toBeDefined()
    expect(blocked.reason).toBe('Vacation')
  })

  it('should query blocked dates by artist', async () => {
    const uniqueId = generateUniqueId()

    const artist = await prisma.artist.create({
      data: {
        clerkId: `artist_${uniqueId}`,
        email: `artist_${uniqueId}@test.com`,
        name: 'Test Artist',
        slug: `artist-slug-${uniqueId}`,
      },
    })

    await prisma.blockedDate.create({
      data: {
        artistId: artist.id,
        date: new Date('2026-05-15'),
        reason: 'Vacation',
      },
    })

    await prisma.blockedDate.create({
      data: {
        artistId: artist.id,
        date: new Date('2026-05-16'),
        reason: 'Event',
      },
    })

    const blocked = await prisma.blockedDate.findMany({
      where: { artistId: artist.id },
    })

    expect(blocked).toHaveLength(2)
  })

  it('should unblock a date', async () => {
    const uniqueId = generateUniqueId()

    const artist = await prisma.artist.create({
      data: {
        clerkId: `artist_${uniqueId}`,
        email: `artist_${uniqueId}@test.com`,
        name: 'Test Artist',
        slug: `artist-slug-${uniqueId}`,
      },
    })

    const blocked = await prisma.blockedDate.create({
      data: {
        artistId: artist.id,
        date: new Date('2026-05-15'),
        reason: 'Vacation',
      },
    })

    await prisma.blockedDate.delete({
      where: { id: blocked.id },
    })

    const remaining = await prisma.blockedDate.findMany({
      where: { artistId: artist.id },
    })

    expect(remaining).toHaveLength(0)
  })
})
