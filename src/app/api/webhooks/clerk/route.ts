import { Webhook } from 'svix'
import { NextRequest, NextResponse } from 'next/server'
import { handleClerkWebhook } from '@/lib/api/webhooks/clerk'

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const headers = request.headers
    
    const svix_id = headers.get('svix-id')
    const svix_timestamp = headers.get('svix-timestamp')
    const svix_signature = headers.get('svix-signature')
    
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
    }
    
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET
    if (!webhookSecret) {
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
    }
    
    const wh = new Webhook(webhookSecret)
    
    let event: any
    try {
      event = wh.verify(JSON.stringify(payload), {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      })
    } catch (err) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
    
    console.log('Clerk webhook received:', event.type)

    const result = await handleClerkWebhook(event as any)

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
