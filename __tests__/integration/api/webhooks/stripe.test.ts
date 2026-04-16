import 'dotenv/config'
import { describe, it, expect, beforeEach } from 'vitest'
import { BookingStatus, PaymentStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { handleStripeWebhook } from '@/lib/api/webhooks/stripe'

function generateUniqueId() {
  return `test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

describe('handleStripeWebhook', () => {
  beforeEach(async () => {
    await prisma.payment.deleteMany()
    await prisma.booking.deleteMany()
    await prisma.artist.deleteMany()
  })

  it('should update booking depositPaid on payment_intent.succeeded', async () => {
    const uniqueId = generateUniqueId()
    const paymentIntentId = `pi_${uniqueId}`

    // Crear artista
    const artist = await prisma.artist.create({
      data: {
        clerkId: `artist_${uniqueId}`,
        email: `artist_${uniqueId}@test.com`,
        name: 'Test Artist',
        slug: `artist-slug-${uniqueId}`,
        depositAmount: 2000,
      },
    })

    // Crear booking ACCEPTED
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
        depositPaid: false,
      },
    })

    // Crear payment PENDING
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        stripePaymentIntentId: paymentIntentId,
        amount: 2000,
        currency: 'eur',
        status: PaymentStatus.PENDING,
      },
    })

    // Simular evento de Stripe
    const event = {
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: paymentIntentId,
          amount: 2000,
          currency: 'eur',
        },
      },
    }

    const result = await handleStripeWebhook(event)

    expect(result.success).toBe(true)
    expect(result.statusCode).toBe(200)

    // Verificar que el booking se actualizó
    const updatedBooking = await prisma.booking.findUnique({
      where: { id: booking.id },
    })
    expect(updatedBooking?.depositPaid).toBe(true)
    expect(updatedBooking?.status).toBe(BookingStatus.CONFIRMED)

    // Verificar que el payment se actualizó
    const updatedPayment = await prisma.payment.findFirst({
      where: { stripePaymentIntentId: paymentIntentId },
    })
    expect(updatedPayment?.status).toBe(PaymentStatus.CAPTURED)
  })

  it('should handle payment_intent.payment_failed', async () => {
    const uniqueId = generateUniqueId()
    const paymentIntentId = `pi_${uniqueId}`

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
        depositPaid: false,
      },
    })

    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        stripePaymentIntentId: paymentIntentId,
        amount: 2000,
        currency: 'eur',
        status: PaymentStatus.PENDING,
      },
    })

    const event = {
      type: 'payment_intent.payment_failed',
      data: {
        object: {
          id: paymentIntentId,
          last_payment_error: {
            message: 'Card declined',
          },
        },
      },
    }

    const result = await handleStripeWebhook(event)

    expect(result.success).toBe(true)
    expect(result.statusCode).toBe(200)

    // Verificar que el payment se marcó como FAILED
    const updatedPayment = await prisma.payment.findFirst({
      where: { stripePaymentIntentId: paymentIntentId },
    })
    expect(updatedPayment?.status).toBe(PaymentStatus.FAILED)
  })

  it('should return 200 for unhandled event types', async () => {
    const event = {
      type: 'charge.succeeded',
      data: {
        object: {
          id: 'ch_test',
        },
      },
    }

    const result = await handleStripeWebhook(event)

    expect(result.success).toBe(true)
    expect(result.statusCode).toBe(200)
  })

  it('should handle unknown payment intent gracefully', async () => {
    const event = {
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_unknown',
          amount: 2000,
        },
      },
    }

    const result = await handleStripeWebhook(event)

    expect(result.success).toBe(false)
    expect(result.statusCode).toBe(404)
  })
})
