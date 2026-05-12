import 'dotenv/config'
import { describe, it, expect, beforeEach } from 'vitest'
import { BookingStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { updateBookingStatus } from '@/lib/api/bookings'

function generateUniqueId() {
  return `test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

describe('updateBookingStatus', () => {
  beforeEach(async () => {
    await prisma.booking.deleteMany()
    await prisma.artist.deleteMany()
  })

  it('should update status to ACCEPTED', async () => {
    const uniqueId = generateUniqueId()

    const artist = await prisma.artist.create({
      data: {
        clerkId: `artist_${uniqueId}`,
        email: `artist_${uniqueId}@test.com`,
        name: 'Test Artist',
        slug: `artist-slug-${uniqueId}`,
      },
    })

    const booking = await prisma.booking.create({
      data: {
        artistId: artist.id,
        clientName: 'María García',
        clientEmail: 'maria@example.com',
        bodyZone: 'brazo',
        size: 'mediano',
        description: 'Test',
        preferredDates: ['2026-05-15'],
        status: BookingStatus.PENDING,
      },
    })

    const result = await updateBookingStatus(booking.id, {
      status: BookingStatus.ACCEPTED,
      proposedDate: new Date('2026-05-15'),
    })

    expect(result.success).toBe(true)
    expect(result.booking?.status).toBe(BookingStatus.ACCEPTED)
    expect(result.booking?.proposedDate).toBeDefined()
  })

  it('should update status to REJECTED', async () => {
    const uniqueId = generateUniqueId()

    const artist = await prisma.artist.create({
      data: {
        clerkId: `artist_${uniqueId}`,
        email: `artist_${uniqueId}@test.com`,
        name: 'Test Artist',
        slug: `artist-slug-${uniqueId}`,
      },
    })

    const booking = await prisma.booking.create({
      data: {
        artistId: artist.id,
        clientName: 'María García',
        clientEmail: 'maria@example.com',
        bodyZone: 'brazo',
        size: 'mediano',
        description: 'Test',
        preferredDates: ['2026-05-15'],
        status: BookingStatus.PENDING,
      },
    })

    const result = await updateBookingStatus(booking.id, {
      status: BookingStatus.REJECTED,
    })

    expect(result.success).toBe(true)
    expect(result.booking?.status).toBe(BookingStatus.REJECTED)
  })

  it('should return 404 if booking not found', async () => {
    const result = await updateBookingStatus('non-existent-id', {
      status: BookingStatus.ACCEPTED,
    })

    expect(result.success).toBe(false)
    expect(result.statusCode).toBe(404)
    expect(result.error).toBe('Booking not found')
  })

  it('should update status to CONFIRMED', async () => {
    const uniqueId = generateUniqueId()

    const artist = await prisma.artist.create({
      data: {
        clerkId: `artist_${uniqueId}`,
        email: `artist_${uniqueId}@test.com`,
        name: 'Test Artist',
        slug: `artist-slug-${uniqueId}`,
      },
    })

    const booking = await prisma.booking.create({
      data: {
        artistId: artist.id,
        clientName: 'María García',
        clientEmail: 'maria@example.com',
        bodyZone: 'brazo',
        size: 'mediano',
        description: 'Test',
        preferredDates: ['2026-05-15'],
        status: BookingStatus.ACCEPTED,
      },
    })

    const result = await updateBookingStatus(booking.id, {
      status: BookingStatus.CONFIRMED,
    })

    expect(result.success).toBe(true)
    expect(result.booking?.status).toBe(BookingStatus.CONFIRMED)
  })
})
