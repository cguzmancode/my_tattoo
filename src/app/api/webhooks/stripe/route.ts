import { NextRequest, NextResponse } from 'next/server'
import { handleStripeWebhook } from '@/lib/api/webhooks/stripe'

export async function POST(request: NextRequest) {
  try {
    // En producción, aquí verificaríamos la firma del webhook de Stripe
    // usando stripe.webhooks.constructEvent()
    const event = await request.json()

    console.log('Stripe webhook received:', event.type)

    const result = await handleStripeWebhook(event)

    return NextResponse.json(
      result.success ? { received: true } : { error: result.error },
      { status: result.statusCode }
    )
  } catch (error) {
    console.error('Error handling Stripe webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
