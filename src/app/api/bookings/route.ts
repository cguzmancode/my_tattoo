import { NextRequest, NextResponse } from 'next/server'
import { createBooking } from '@/lib/api/bookings'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const result = await createBooking({
      artistSlug: body.artistSlug,
      clientName: body.clientName,
      clientEmail: body.clientEmail,
      clientPhone: body.clientPhone,
      bodyZone: body.bodyZone,
      size: body.size,
      description: body.description,
      preferredDates: body.preferredDates,
    })

    return NextResponse.json(
      result.success ? { success: true, booking: result.booking } : { success: false, error: result.error },
      { status: result.statusCode }
    )
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
