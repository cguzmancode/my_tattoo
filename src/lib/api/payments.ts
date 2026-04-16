import { BookingStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export interface CreatePaymentIntentResult {
  success: boolean
  clientSecret?: string
  amount?: number
  currency?: string
  error?: string
  statusCode: number
}

export async function createPaymentIntent(
  bookingId: string
): Promise<CreatePaymentIntentResult> {
  // Buscar el booking
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { artist: true },
  })

  if (!booking) {
    return {
      success: false,
      error: 'Booking not found',
      statusCode: 404,
    }
  }

  // Verificar que el booking esté en estado ACCEPTED
  if (booking.status !== BookingStatus.ACCEPTED) {
    return {
      success: false,
      error: 'Booking not ready for payment',
      statusCode: 400,
    }
  }

  // Verificar que no se haya pagado ya
  if (booking.depositPaid) {
    return {
      success: false,
      error: 'Deposit already paid',
      statusCode: 400,
    }
  }

  // Por ahora, retornamos un mock del clientSecret
  // En la implementación real, esto crearía un PaymentIntent en Stripe
  const amount = booking.artist.depositAmount

  return {
    success: true,
    clientSecret: `pi_mock_${bookingId}_secret`,
    amount,
    currency: 'eur',
    statusCode: 200,
  }
}
