'use server'

import { prisma } from '@/lib/prisma'
import { BookingStatus } from '@prisma/client'

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

export async function addMessageToBooking(bookingId: string, message: string, sender: 'client' | 'artist') {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  })

  if (!booking) {
    throw new Error('Booking not found')
  }

  const newMessage = await prisma.bookingMessage.create({
    data: {
      bookingId,
      sender,
      message,
    },
  })

  return newMessage
}
