import 'dotenv/config'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined')
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

describe('Artist Model', () => {
  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should create artist with required fields', async () => {
    const uniqueId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    const artist = await prisma.artist.create({
      data: {
        clerkId: uniqueId,
        email: `${uniqueId}@test.com`,
        name: 'Ink Studio',
        slug: `ink-studio-${uniqueId}`,
      },
    })

    expect(artist).toBeDefined()
    expect(artist.email).toBe(`${uniqueId}@test.com`)
    expect(artist.name).toBe('Ink Studio')
    expect(artist.slug).toBe(`ink-studio-${uniqueId}`)
    expect(artist.depositAmount).toBe(2000) // default value
    expect(artist.isActive).toBe(true) // default value
  })

  it('should enforce unique clerkId constraint', async () => {
    const uniqueId = `clerk_${Date.now()}`

    await prisma.artist.create({
      data: {
        clerkId: uniqueId,
        email: `first_${uniqueId}@test.com`,
        name: 'Artist 1',
        slug: `slug-first-${uniqueId}`,
      },
    })

    await expect(
      prisma.artist.create({
        data: {
          clerkId: uniqueId, // same clerkId
          email: `second_${uniqueId}@test.com`,
          name: 'Artist 2',
          slug: `slug-second-${uniqueId}`,
        },
      })
    ).rejects.toThrow()
  })

  it('should enforce unique slug constraint', async () => {
    const uniqueId = `slug_${Date.now()}`
    const sharedSlug = `shared-slug-${uniqueId}`

    await prisma.artist.create({
      data: {
        clerkId: `first_${uniqueId}`,
        email: `first_${uniqueId}@test.com`,
        name: 'Artist 1',
        slug: sharedSlug,
      },
    })

    await expect(
      prisma.artist.create({
        data: {
          clerkId: `second_${uniqueId}`,
          email: `second_${uniqueId}@test.com`,
          name: 'Artist 2',
          slug: sharedSlug, // same slug
        },
      })
    ).rejects.toThrow()
  })

  it('should query artist by slug', async () => {
    const uniqueId = `query_${Date.now()}`

    await prisma.artist.create({
      data: {
        clerkId: uniqueId,
        email: `${uniqueId}@test.com`,
        name: 'Ink Studio',
        slug: `query-slug-${uniqueId}`,
      },
    })

    const found = await prisma.artist.findUnique({
      where: { slug: `query-slug-${uniqueId}` },
    })

    expect(found).toBeDefined()
    expect(found?.name).toBe('Ink Studio')
  })

  it('should update artist fields', async () => {
    const uniqueId = `update_${Date.now()}`

    const artist = await prisma.artist.create({
      data: {
        clerkId: uniqueId,
        email: `${uniqueId}@test.com`,
        name: 'Ink Studio',
        slug: `update-slug-${uniqueId}`,
      },
    })

    const updated = await prisma.artist.update({
      where: { id: artist.id },
      data: { name: 'Updated Studio' },
    })

    expect(updated.name).toBe('Updated Studio')
  })
})
