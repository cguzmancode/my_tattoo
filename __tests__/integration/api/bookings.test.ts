import 'dotenv/config'
import { describe, it, expect, beforeEach } from 'vitest'
import { prisma } from '@/lib/prisma'
import { createBooking } from '@/lib/api/bookings'

function generateUniqueId() {
  return `test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

describe('createBooking', () => {
  beforeEach(async () => {
    await prisma.booking.deleteMany()
    await prisma.artist.deleteMany()
  })

  it('should create booking with valid data', async () => {
    const uniqueId = generateUniqueId()

    // Crear artista primero
    const artist = await prisma.artist.create({
      data: {
        clerkId: `artist_${uniqueId}`,
        email: `artist_${uniqueId}@test.com`,
        name: 'Test Artist',
        slug: `artist-slug-${uniqueId}`,
      },
    })

    const result = await createBooking({
      artistSlug: artist.slug,
      clientName: 'María García',
      clientEmail: 'maria@example.com',
      bodyZone: 'brazo',
      size: 'mediano',
      description: 'Minimalist rose tattoo',
      preferredDates: ['2026-05-15', '2026-05-16'],
    })

    expect(result.success).toBe(true)
    expect(result.statusCode).toBe(201)
    expect(result.booking).toBeDefined()
    expect(result.booking?.clientName).toBe('María García')
    expect(result.booking?.status).toBe('PENDING')
    expect(result.booking?.artistId).toBe(artist.id)
  })

  it('should return 400 with missing required fields', async () => {
    const result = await createBooking({
      artistSlug: 'test-artist',
      clientName: '', // empty - invalid
      clientEmail: 'maria@example.com',
      bodyZone: 'brazo',
      size: 'mediano',
      description: 'Test',
      preferredDates: ['2026-05-15'],
    })

    expect(result.success).toBe(false)
    expect(result.statusCode).toBe(400)
    expect(result.error).toBe('Missing required fields')
  })

  it('should return 404 if artist not found', async () => {
    const result = await createBooking({
      artistSlug: 'non-existent-artist-slug',
      clientName: 'María García',
      clientEmail: 'maria@example.com',
      bodyZone: 'brazo',
      size: 'mediano',
      description: 'Test',
      preferredDates: ['2026-05-15'],
    })

    expect(result.success).toBe(false)
    expect(result.statusCode).toBe(404)
    expect(result.error).toBe('Artist not found')
  })

  it('should handle optional phone field', async () => {
    const uniqueId = generateUniqueId()

    const artist = await prisma.artist.create({
      data: {
        clerkId: `artist_${uniqueId}`,
        email: `artist_${uniqueId}@test.com`,
        name: 'Test Artist',
        slug: `artist-slug-${uniqueId}`,
      },
    })

    const result = await createBooking({
      artistSlug: artist.slug,
      clientName: 'María García',
      clientEmail: 'maria@example.com',
      clientPhone: '+34612345678',
      bodyZone: 'brazo',
      size: 'mediano',
      description: 'Minimalist rose',
      preferredDates: ['2026-05-15'],
    })

    expect(result.success).toBe(true)
    expect(result.booking).toBeDefined()
  })
})
