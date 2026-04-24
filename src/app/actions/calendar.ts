'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export interface BlockDateInput {
  date: string
  reason?: string
}

export async function blockDate(input: BlockDateInput) {
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

  const normalizedDate = new Date(input.date + 'T00:00:00.000Z')

  try {
    const blocked = await prisma.blockedDate.create({
      data: {
        artistId: artist.id,
        date: normalizedDate,
        reason: input.reason,
      },
    })

    revalidatePath('/dashboard/calendar')

    return blocked
  } catch (error) {
    // Si ya existe, no es error
    if (error instanceof Error && error.message.includes('unique constraint')) {
      throw new Error('Date already blocked')
    }
    throw error
  }
}

export async function unblockDate(blockedDateId: string) {
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

  // Verificar que la fecha bloqueada pertenezca al artista
  const blocked = await prisma.blockedDate.findFirst({
    where: {
      id: blockedDateId,
      artistId: artist.id,
    },
  })

  if (!blocked) {
    throw new Error('Blocked date not found')
  }

  await prisma.blockedDate.delete({
    where: { id: blockedDateId },
  })

  revalidatePath('/dashboard/calendar')

  return { success: true }
}

export async function unblockDateByDate(input: { date: string }) {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: 'Unauthorized' }
  }

  const artist = await prisma.artist.findUnique({
    where: { clerkId: userId },
  })

  if (!artist) {
    return { success: false, error: 'Artist not found' }
  }

  const normalizedDate = new Date(input.date + 'T00:00:00.000Z')

  // Buscar la fecha bloqueada por fecha y artista
  const blocked = await prisma.blockedDate.findFirst({
    where: {
      artistId: artist.id,
      date: normalizedDate,
    },
  })

  if (!blocked) {
    return { success: false, error: 'Blocked date not found' }
  }

  await prisma.blockedDate.delete({
    where: { id: blocked.id },
  })

  revalidatePath('/dashboard/calendar')

  return { success: true }
}

export async function getBlockedDates(startDate: Date, endDate: Date) {
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

  const blockedDates = await prisma.blockedDate.findMany({
    where: {
      artistId: artist.id,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { date: 'asc' },
  })

  return blockedDates
}

export async function getCalendarData(month: number, year: number) {
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

  // Calcular rango del mes
  const startOfMonth = new Date(year, month - 1, 1)
  const endOfMonth = new Date(year, month, 0)

  const [bookings, blockedDates] = await Promise.all([
    prisma.booking.findMany({
      where: {
        artistId: artist.id,
        status: { in: ['ACCEPTED', 'CONFIRMED'] },
        OR: [
          { proposedDate: { gte: startOfMonth, lte: endOfMonth } },
          { createdAt: { gte: startOfMonth, lte: endOfMonth } },
        ],
      },
      select: {
        id: true,
        clientName: true,
        status: true,
        proposedDate: true,
      },
    }),
    prisma.blockedDate.findMany({
      where: {
        artistId: artist.id,
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    }),
  ])

  return { bookings, blockedDates }
}

export async function updateBookingDate(bookingId: string, newDate: string) {
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
  })

  if (!booking) {
    throw new Error('Booking not found')
  }

  if (!['ACCEPTED', 'CONFIRMED'].includes(booking.status)) {
    throw new Error('Can only reschedule bookings in ACCEPTED or CONFIRMED status')
  }

  const normalizedDate = new Date(newDate + 'T00:00:00.000Z')

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { proposedDate: normalizedDate },
  })

  revalidatePath('/dashboard/calendar')
  revalidatePath('/dashboard/bookings')

  return updated
}
