import { NextRequest, NextResponse } from 'next/server'
import { handleClerkWebhook } from '@/lib/api/webhooks/clerk'

export async function POST(request: NextRequest) {
  try {
    // En producción, aquí verificaríamos la firma del webhook de Clerk
    // usando svix o similar
    const event = await request.json()

    console.log('Clerk webhook received:', event.type)

    const result = await handleClerkWebhook(event)

    return NextResponse.json(
      result.success
        ? { success: true, artist: result.artist }
        : { error: result.error },
      { status: result.statusCode }
    )
  } catch (error) {
    console.error('Error handling Clerk webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
