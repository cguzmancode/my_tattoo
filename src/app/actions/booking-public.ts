'use server'

import { randomUUID } from 'node:crypto'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { bookingsModule } from '@/modules/bookings/composition-root'
import { UnauthorizedBookingAccessError } from '@/modules/bookings/domain/errors'

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

export type AddMessagePayload =
  | { sender: 'artist'; message: string }
  | { sender: 'client'; message: string; clientEmail: string }

export type AddMessageResult =
  | { ok: true; messageId: string }
  | { ok: false; error: 'unauthorized' | 'unknown' }

export async function addMessageToBooking(
  bookingId: string,
  payload: AddMessagePayload,
): Promise<AddMessageResult> {
  const messageId = randomUUID()

  try {
    if (payload.sender === 'artist') {
      const { userId } = await auth()
      if (!userId) {
        return { ok: false, error: 'unauthorized' }
      }

      const artist = await prisma.artist.findUnique({
        where: { clerkId: userId },
        select: { id: true },
      })
      if (!artist) {
        return { ok: false, error: 'unauthorized' }
      }

      await bookingsModule.addMessageToBooking.execute({
        bookingId,
        messageId,
        message: payload.message,
        sender: 'ARTIST',
        artistId: artist.id,
      })
    } else {
      await bookingsModule.addMessageToBooking.execute({
        bookingId,
        messageId,
        message: payload.message,
        sender: 'CLIENT',
        clientEmail: payload.clientEmail,
      })
    }
  } catch (error) {
    if (error instanceof UnauthorizedBookingAccessError) {
      return { ok: false, error: 'unauthorized' }
    }
    throw error
  }

  return { ok: true, messageId }
}
