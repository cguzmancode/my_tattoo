'use server'

import { auth } from '@clerk/nextjs/server'
import { BookingStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

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

  // Buscar el artista por clerkId
  const artist = await prisma.artist.findUnique({
    where: { clerkId: userId },
  })

  if (!artist) {
    throw new Error('Artist not found')
  }

  // Construir where clause
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
  input: UpdateBookingStatusInput
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

  // Verificar que el booking pertenezca al artista
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      artistId: artist.id,
    },
  })

  if (!booking) {
    throw new Error('Booking not found')
  }

  // Validar transiciones de estado
  const validTransitions: { [key in BookingStatus]?: BookingStatus[] } = {
    PENDING: ['ACCEPTED', 'REJECTED'],
    ACCEPTED: ['CONFIRMED', 'REJECTED'],
    CONFIRMED: ['COMPLETED', 'CANCELLED'],
  }

  const allowedTransitions = validTransitions[booking.status]
  // Solo validar transición si el estado está cambiando
  if (booking.status !== input.status && !allowedTransitions?.includes(input.status)) {
    throw new Error(`Invalid status transition from ${booking.status} to ${input.status}`)
  }

  // Convertir proposedDate a Date si es string
  const proposedDate = input.proposedDate
    ? typeof input.proposedDate === 'string'
      ? new Date(input.proposedDate)
      : input.proposedDate
    : undefined

  // Actualizar booking
  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: input.status,
      proposedDate,
      priceEstimate: input.priceEstimate,
      durationEstimate: input.durationEstimate,
      artistNotes: input.artistNotes,
    },
  })

  revalidatePath('/dashboard/bookings')
  revalidatePath(`/dashboard/bookings/${bookingId}`)

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
