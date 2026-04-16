import { NextRequest, NextResponse } from 'next/server'
import { createPaymentIntent } from '@/lib/api/payments'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar que tengamos bookingId
    if (!body.bookingId) {
      return NextResponse.json(
        { success: false, error: 'Missing bookingId' },
        { status: 400 }
      )
    }

    const result = await createPaymentIntent(body.bookingId)

    return NextResponse.json(
      result.success
        ? {
            success: true,
            clientSecret: result.clientSecret,
            amount: result.amount,
            currency: result.currency,
          }
        : { success: false, error: result.error },
      { status: result.statusCode }
    )
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
