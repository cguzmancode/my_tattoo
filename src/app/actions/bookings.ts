'use server'

import { randomUUID } from 'node:crypto'
import { auth } from '@clerk/nextjs/server'
import { BookingStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { bookingsModule } from '@/modules/bookings/composition-root'

export interface BookingFilters {
  status?: BookingStatus
  startDate?: Date
  endDate?: Date
}

export async function getArtistBookings(filters?: BookingFilters) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Unauthorized')
  }

  const artist = await prisma.artist.findUnique({
    where: { clerkId: userId },
  })

  if (!artist) {
    throw new Error('Artist not found')
  }

  const where: { artistId: string; status?: BookingStatus; createdAt?: { gte?: Date; lte?: Date } } = {
    artistId: artist.id,
  }

  if (filters?.status) {
    where.status = filters.status
  }

  if (filters?.startDate || filters?.endDate) {
    where.createdAt = {}
    if (filters.startDate) where.createdAt.gte = filters.startDate
    if (filters.endDate) where.createdAt.lte = filters.endDate
  }

  const bookings = await prisma.booking.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      payments: {
        where: { status: { not: 'FAILED' } },
        select: { id: true, status: true, amount: true },
      },
    },
  })

  return bookings
}

export async function getBookingById(bookingId: string) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Unauthorized')
  }

  const artist = await prisma.artist.findUnique({
    where: { clerkId: userId },
  })

  if (!artist) {
    throw new Error('Artist not found')
  }

  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      artistId: artist.id,
    },
    include: {
      payments: true,
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!booking) {
    throw new Error('Booking not found')
  }

  return booking
}

export interface UpdateBookingStatusInput {
  status: BookingStatus
  proposedDate?: Date | string
  rejectionReason?: string
  priceEstimate?: number
  durationEstimate?: string
  artistNotes?: string
}

export async function updateBookingStatus(
  bookingId: string,
  input: UpdateBookingStatusInput,
) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Unauthorized')
  }

  const artist = await prisma.artist.findUnique({
    where: { clerkId: userId },
  })

  if (!artist) {
    throw new Error('Artist not found')
  }

  const current = await prisma.booking.findFirst({
    where: { id: bookingId, artistId: artist.id },
    select: { status: true },
  })

  if (!current) {
    throw new Error('Booking not found')
  }

  if (current.status !== input.status) {
    switch (input.status) {
      case BookingStatus.ACCEPTED: {
        if (!input.proposedDate) {
          throw new Error('proposedDate is required when accepting a booking')
        }
        const iso =
          typeof input.proposedDate === 'string'
            ? input.proposedDate
            : input.proposedDate.toISOString()
        await bookingsModule.acceptBooking.execute({
          bookingId,
          artistId: artist.id,
          proposedDateISO: iso,
        })
        break
      }
      case BookingStatus.REJECTED: {
        await bookingsModule.rejectBooking.execute({
          bookingId,
          artistId: artist.id,
        })
        if (input.rejectionReason && input.rejectionReason.trim().length > 0) {
          await bookingsModule.addMessageToBooking.execute({
            bookingId,
            messageId: randomUUID(),
            message: input.rejectionReason,
            sender: 'ARTIST',
            artistId: artist.id,
          })
        }
        break
      }
      case BookingStatus.CONFIRMED: {
        await bookingsModule.confirmBooking.execute({
          bookingId,
          artistId: artist.id,
        })
        break
      }
      case BookingStatus.COMPLETED: {
        await bookingsModule.completeBooking.execute({
          bookingId,
          artistId: artist.id,
        })
        break
      }
      case BookingStatus.CANCELLED: {
        await bookingsModule.cancelBooking.execute({
          bookingId,
          artistId: artist.id,
        })
        break
      }
      default: {
        throw new Error(`Unsupported target status: ${input.status}`)
      }
    }
  }

  if (
    input.priceEstimate !== undefined ||
    input.durationEstimate !== undefined ||
    input.artistNotes !== undefined
  ) {
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        priceEstimate: input.priceEstimate,
        durationEstimate: input.durationEstimate,
        artistNotes: input.artistNotes,
      },
    })
  }

  revalidatePath('/dashboard/bookings')
  revalidatePath(`/dashboard/bookings/${bookingId}`)

  const updated = await prisma.booking.findUnique({ where: { id: bookingId } })
  if (!updated) {
    throw new Error('Booking not found after update')
  }
  return updated
}

export async function getBookingStats() {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Unauthorized')
  }

  const artist = await prisma.artist.findUnique({
    where: { clerkId: userId },
  })

  if (!artist) {
    throw new Error('Artist not found')
  }

  const [pending, accepted, confirmed, total] = await Promise.all([
    prisma.booking.count({ where: { artistId: artist.id, status: 'PENDING' } }),
    prisma.booking.count({ where: { artistId: artist.id, status: 'ACCEPTED' } }),
    prisma.booking.count({ where: { artistId: artist.id, status: 'CONFIRMED' } }),
    prisma.booking.count({ where: { artistId: artist.id } }),
  ])

  return { pending, accepted, confirmed, total }
}
