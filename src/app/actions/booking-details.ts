'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { BookingStatus } from '@prisma/client'

export interface BookingDetailsInput {
  priceEstimate?: number
  durationEstimate?: string
  artistNotes?: string
  proposedDate?: Date
  status?: BookingStatus
  depositPaid?: boolean
}

export async function updateBookingDetails(
  bookingId: string,
  input: BookingDetailsInput
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      throw new Error('Unauthorized')
    }

    // Verificar que el booking pertenece al artista actual
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { artist: true },
    })

    if (!booking || booking.artist.clerkId !== userId) {
      throw new Error('Booking not found or unauthorized')
    }

    // Actualizar los campos
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        priceEstimate: input.priceEstimate,
        durationEstimate: input.durationEstimate,
        artistNotes: input.artistNotes,
        proposedDate: input.proposedDate,
        status: input.status,
        depositPaid: input.depositPaid,
      },
    })

    revalidatePath('/dashboard/bookings')
    revalidatePath('/dashboard/calendar')

    return { success: true, booking: updatedBooking }
  } catch (error) {
    console.error('Error updating booking details:', error)
    throw error
  }
}

export async function checkDateConflicts(
  artistId: string,
  date: Date,
  excludeBookingId?: string
) {
  try {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const conflictingBookings = await prisma.booking.findMany({
      where: {
        artistId,
        id: { not: excludeBookingId },
        status: { in: ['ACCEPTED', 'CONFIRMED'] },
        proposedDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        artist: {
          select: {
            name: true,
          },
        },
      },
    })

    return { conflicts: conflictingBookings }
  } catch (error) {
    console.error('Error checking date conflicts:', error)
    throw error
  }
}
