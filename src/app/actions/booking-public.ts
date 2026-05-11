'use server'

import { randomUUID } from 'node:crypto'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { bookingsModule } from '@/modules/bookings/composition-root'

export async function getPublicBookingById(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      artist: {
        select: {
          id: true,
          name: true,
          email: true,
          instagramUrl: true,
        },
      },
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!booking) {
    return null
  }

  return booking
}

export async function getBookingMessages(bookingId: string) {
  const messages = await prisma.bookingMessage.findMany({
    where: { bookingId },
    orderBy: { createdAt: 'asc' },
  })

  return messages
}

export async function addMessageToBooking(
  bookingId: string,
  message: string,
  sender: 'client' | 'artist',
) {
  const messageId = randomUUID()

  if (sender === 'artist') {
    const { userId } = await auth()
    if (!userId) {
      throw new Error('Unauthorized')
    }

    const artist = await prisma.artist.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })
    if (!artist) {
      throw new Error('Artist not found')
    }

    await bookingsModule.addMessageToBooking.execute({
      bookingId,
      messageId,
      message,
      sender: 'ARTIST',
      artistId: artist.id,
    })
  } else {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { clientEmail: true },
    })
    if (!booking) {
      throw new Error('Booking not found')
    }

    await bookingsModule.addMessageToBooking.execute({
      bookingId,
      messageId,
      message,
      sender: 'CLIENT',
      clientEmail: booking.clientEmail,
    })
  }

  const created = await prisma.bookingMessage.findUnique({
    where: { id: messageId },
  })
  if (!created) {
    throw new Error('Message was not persisted')
  }
  return created
}
