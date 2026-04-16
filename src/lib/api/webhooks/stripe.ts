import { BookingStatus, PaymentStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'

interface StripeEvent {
  type: string
  data: {
    object: {
      id: string
      amount?: number
      currency?: string
      last_payment_error?: {
        message: string
      }
    }
  }
}

export interface WebhookResult {
  success: boolean
  error?: string
  statusCode: number
}

export async function handleStripeWebhook(event: StripeEvent): Promise<WebhookResult> {
  switch (event.type) {
    case 'payment_intent.succeeded':
      return handlePaymentIntentSucceeded(event)

    case 'payment_intent.payment_failed':
      return handlePaymentIntentFailed(event)

    default:
      // Ignorar eventos no manejados
      console.log(`Unhandled event type: ${event.type}`)
      return { success: true, statusCode: 200 }
  }
}

async function handlePaymentIntentSucceeded(event: StripeEvent): Promise<WebhookResult> {
  const paymentIntentId = event.data.object.id

  // Buscar el payment en nuestra DB
  const payment = await prisma.payment.findFirst({
    where: { stripePaymentIntentId: paymentIntentId },
    include: { booking: true },
  })

  if (!payment) {
    return {
      success: false,
      error: 'Payment not found',
      statusCode: 404,
    }
  }

  // Actualizar el payment a CAPTURED
  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: PaymentStatus.CAPTURED },
  })

  // Actualizar el booking: marcar depositPaid y cambiar status a CONFIRMED
  await prisma.booking.update({
    where: { id: payment.bookingId },
    data: {
      depositPaid: true,
      status: BookingStatus.CONFIRMED,
    },
  })

  return { success: true, statusCode: 200 }
}

async function handlePaymentIntentFailed(event: StripeEvent): Promise<WebhookResult> {
  const paymentIntentId = event.data.object.id

  const payment = await prisma.payment.findFirst({
    where: { stripePaymentIntentId: paymentIntentId },
  })

  if (!payment) {
    return {
      success: false,
      error: 'Payment not found',
      statusCode: 404,
    }
  }

  // Actualizar el payment a FAILED
  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: PaymentStatus.FAILED },
  })

  return { success: true, statusCode: 200 }
}
