import { NextRequest, NextResponse } from 'next/server'
import { BookingStatus } from '@prisma/client'
import { updateBookingStatus } from '@/lib/api/bookings'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validar status
    if (!body.status || !Object.values(BookingStatus).includes(body.status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      )
    }

    const result = await updateBookingStatus(id, {
      status: body.status,
      proposedDate: body.proposedDate ? new Date(body.proposedDate) : undefined,
    })

    return NextResponse.json(
      result.success
        ? { success: true, booking: result.booking }
        : { success: false, error: result.error },
      { status: result.statusCode }
    )
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
