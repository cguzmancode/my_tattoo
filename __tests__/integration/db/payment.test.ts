import 'dotenv/config'
import { describe, it, expect, afterAll } from 'vitest'
import { PaymentStatus, BookingStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'

function generateUniqueId() {
  return `test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

describe('Payment Model', () => {
  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should create payment with PENDING status', async () => {
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
        clientName: 'Test Client',
        clientEmail: `client_${uniqueId}@example.com`,
        bodyZone: 'brazo',
        size: 'mediano',
        description: 'Payment test tattoo',
        preferredDates: ['2026-05-15'],
      },
    })

    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        stripePaymentIntentId: `pi_test_${uniqueId}`,
        amount: 2000,
        currency: 'eur',
      },
    })

    expect(payment).toBeDefined()
    expect(payment.amount).toBe(2000)
    expect(payment.currency).toBe('eur')
    expect(payment.status).toBe(PaymentStatus.PENDING)
  })

  it('should update status to CAPTURED', async () => {
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
        clientName: 'Test Client',
        clientEmail: `client_${uniqueId}@example.com`,
        bodyZone: 'brazo',
        size: 'mediano',
        description: 'Payment test tattoo',
        preferredDates: ['2026-05-15'],
      },
    })

    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        stripePaymentIntentId: `pi_test_${uniqueId}_2`,
        amount: 2000,
        currency: 'eur',
      },
    })

    const updated = await prisma.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.CAPTURED },
    })

    expect(updated.status).toBe(PaymentStatus.CAPTURED)
  })

  it('should relate to booking', async () => {
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
        clientName: 'Test Client',
        clientEmail: `client_${uniqueId}@example.com`,
        bodyZone: 'brazo',
        size: 'mediano',
        description: 'Payment test tattoo',
        preferredDates: ['2026-05-15'],
      },
    })

    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        stripePaymentIntentId: `pi_test_${uniqueId}_3`,
        amount: 2000,
        currency: 'eur',
      },
      include: { booking: true },
    })

    expect(payment.booking).toBeDefined()
    expect(payment.booking.id).toBe(booking.id)
  })

  it('should enforce unique stripePaymentIntentId', async () => {
    const uniqueId = generateUniqueId()

    const artist = await prisma.artist.create({
      data: {
        clerkId: `artist_${uniqueId}`,
        email: `artist_${uniqueId}@test.com`,
        name: 'Test Artist',
        slug: `artist-slug-${uniqueId}`,
      },
    })

    const booking1 = await prisma.booking.create({
      data: {
        artistId: artist.id,
        clientName: 'Client 1',
        clientEmail: `client1_${uniqueId}@example.com`,
        bodyZone: 'brazo',
        size: 'mediano',
        description: 'Tattoo 1',
        preferredDates: ['2026-05-15'],
      },
    })

    const booking2 = await prisma.booking.create({
      data: {
        artistId: artist.id,
        clientName: 'Client 2',
        clientEmail: `client2_${uniqueId}@example.com`,
        bodyZone: 'pierna',
        size: 'grande',
        description: 'Tattoo 2',
        preferredDates: ['2026-05-16'],
      },
    })

    const sharedStripeId = `pi_unique_${uniqueId}`

    await prisma.payment.create({
      data: {
        bookingId: booking1.id,
        stripePaymentIntentId: sharedStripeId,
        amount: 2000,
        currency: 'eur',
      },
    })

    await expect(
      prisma.payment.create({
        data: {
          bookingId: booking2.id,
          stripePaymentIntentId: sharedStripeId, // same id
          amount: 3000,
          currency: 'eur',
        },
      })
    ).rejects.toThrow()
  })
})
