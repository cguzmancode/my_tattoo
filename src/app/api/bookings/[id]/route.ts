import { NextRequest, NextResponse } from 'next/server'
import { BookingStatus } from '@prisma/client'
import { auth } from '@clerk/nextjs/server'
import { updateBookingStatus } from '@/lib/api/bookings'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Security: Require authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify the booking belongs to this artist
    const artist = await prisma.artist.findUnique({
      where: { clerkId: userId },
    })
    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 })
    }

    const { id } = await params
    const booking = await prisma.booking.findFirst({
      where: { id, artistId: artist.id },
    })
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

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
