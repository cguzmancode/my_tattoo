import 'dotenv/config'
import { describe, it, expect, beforeEach } from 'vitest'
import { prisma } from '@/lib/prisma'
import { handleClerkWebhook } from '@/lib/api/webhooks/clerk'

function generateUniqueId() {
  return `test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

describe('handleClerkWebhook', () => {
  beforeEach(async () => {
    await prisma.booking.deleteMany()
    await prisma.artist.deleteMany()
  })

  it('should create artist on user.created', async () => {
    const uniqueId = generateUniqueId()

    const event = {
      type: 'user.created',
      data: {
        id: `user_${uniqueId}`,
        email_addresses: [
          { email_address: `artist_${uniqueId}@test.com` },
        ],
        first_name: 'Test',
        last_name: 'Artist',
      },
    }

    const result = await handleClerkWebhook(event)

    expect(result.success).toBe(true)
    expect(result.statusCode).toBe(201)

    // Verificar que el artista se creó
    const artist = await prisma.artist.findUnique({
      where: { clerkId: `user_${uniqueId}` },
    })

    expect(artist).toBeDefined()
    expect(artist?.email).toBe(`artist_${uniqueId}@test.com`)
    expect(artist?.name).toBe('Test Artist')
    expect(artist?.slug).toContain('test-artist')
  })

  it('should update artist on user.updated', async () => {
    const uniqueId = generateUniqueId()
    const clerkId = `user_${uniqueId}`

    // Crear artista primero
    await prisma.artist.create({
      data: {
        clerkId: clerkId,
        email: `old_${uniqueId}@test.com`,
        name: 'Old Name',
        slug: `old-slug-${uniqueId}`,
      },
    })

    const event = {
      type: 'user.updated',
      data: {
        id: clerkId,
        email_addresses: [
          { email_address: `new_${uniqueId}@test.com` },
        ],
        first_name: 'Updated',
        last_name: 'Name',
      },
    }

    const result = await handleClerkWebhook(event)

    expect(result.success).toBe(true)
    expect(result.statusCode).toBe(200)

    // Verificar actualización
    const artist = await prisma.artist.findUnique({
      where: { clerkId },
    })

    expect(artist?.email).toBe(`new_${uniqueId}@test.com`)
    expect(artist?.name).toBe('Updated Name')
  })

  it('should handle duplicate webhooks idempotently', async () => {
    const uniqueId = generateUniqueId()
    const clerkId = `user_${uniqueId}`

    const event = {
      type: 'user.created',
      data: {
        id: clerkId,
        email_addresses: [
          { email_address: `artist_${uniqueId}@test.com` },
        ],
        first_name: 'Test',
        last_name: 'Artist',
      },
    }

    // Primera vez
    const result1 = await handleClerkWebhook(event)
    expect(result1.success).toBe(true)
    expect(result1.statusCode).toBe(201)

    // Segunda vez (duplicado)
    const result2 = await handleClerkWebhook(event)
    expect(result2.success).toBe(true)
    expect(result2.statusCode).toBe(200) // Ya existe, no error

    // Verificar que solo hay un artista
    const count = await prisma.artist.count({
      where: { clerkId },
    })
    expect(count).toBe(1)
  })

  it('should handle unhandled event types', async () => {
    const event = {
      type: 'user.deleted',
      data: {
        id: `user_${generateUniqueId()}`,
      },
    }

    const result = await handleClerkWebhook(event)

    expect(result.success).toBe(true)
    expect(result.statusCode).toBe(200)
  })
})
