import 'dotenv/config'
import { describe, it, expect, beforeEach } from 'vitest'
import { BookingStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { createPaymentIntent } from '@/lib/api/payments'

function generateUniqueId() {
  return `test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

describe('createPaymentIntent', () => {
  beforeEach(async () => {
    await prisma.payment.deleteMany()
    await prisma.booking.deleteMany()
    await prisma.artist.deleteMany()
  })

  it('should create payment intent for booking', async () => {
    const uniqueId = generateUniqueId()

    // Crear artista con depositAmount configurado
    const artist = await prisma.artist.create({
      data: {
        clerkId: `artist_${uniqueId}`,
        email: `artist_${uniqueId}@test.com`,
        name: 'Test Artist',
        slug: `artist-slug-${uniqueId}`,
        depositAmount: 2000, // €20.00
      },
    })

    // Crear booking ACCEPTED (requiere depósito)
    const booking = await prisma.booking.create({
      data: {
        artistId: artist.id,
        clientName: 'María García',
        clientEmail: 'maria@example.com',
        bodyZone: 'brazo',
        size: 'mediano',
        description: 'Minimalist rose',
        preferredDates: ['2026-05-15'],
        status: BookingStatus.ACCEPTED,
      },
    })

    const result = await createPaymentIntent(booking.id)

    expect(result.success).toBe(true)
    expect(result.statusCode).toBe(200)
    expect(result.clientSecret).toBeDefined()
    expect(result.amount).toBe(2000)
    expect(result.currency).toBe('eur')
  })

  it('should return 404 if booking not found', async () => {
    const result = await createPaymentIntent('non-existent-id')

    expect(result.success).toBe(false)
    expect(result.statusCode).toBe(404)
    expect(result.error).toBe('Booking not found')
  })

  it('should return 400 if booking not in ACCEPTED status', async () => {
    const uniqueId = generateUniqueId()

    const artist = await prisma.artist.create({
      data: {
        clerkId: `artist_${uniqueId}`,
        email: `artist_${uniqueId}@test.com`,
        name: 'Test Artist',
        slug: `artist-slug-${uniqueId}`,
        depositAmount: 2000,
      },
    })

    // Crear booking PENDING (no requiere depósito aún)
    const booking = await prisma.booking.create({
      data: {
        artistId: artist.id,
        clientName: 'María García',
        clientEmail: 'maria@example.com',
        bodyZone: 'brazo',
        size: 'mediano',
        description: 'Minimalist rose',
        preferredDates: ['2026-05-15'],
        status: BookingStatus.PENDING,
      },
    })

    const result = await createPaymentIntent(booking.id)

    expect(result.success).toBe(false)
    expect(result.statusCode).toBe(400)
    expect(result.error).toBe('Booking not ready for payment')
  })

  it('should return 400 if deposit already paid', async () => {
    const uniqueId = generateUniqueId()

    const artist = await prisma.artist.create({
      data: {
        clerkId: `artist_${uniqueId}`,
        email: `artist_${uniqueId}@test.com`,
        name: 'Test Artist',
        slug: `artist-slug-${uniqueId}`,
        depositAmount: 2000,
      },
    })

    const booking = await prisma.booking.create({
      data: {
        artistId: artist.id,
        clientName: 'María García',
        clientEmail: 'maria@example.com',
        bodyZone: 'brazo',
        size: 'mediano',
        description: 'Minimalist rose',
        preferredDates: ['2026-05-15'],
        status: BookingStatus.ACCEPTED,
        depositPaid: true,
      },
    })

    const result = await createPaymentIntent(booking.id)

    expect(result.success).toBe(false)
    expect(result.statusCode).toBe(400)
    expect(result.error).toBe('Deposit already paid')
  })
})
