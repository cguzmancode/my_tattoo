import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { BookingsClient } from './bookings-client'
import { DEMO_BOOKINGS } from '@/lib/mocks'

export default async function BookingsPage() {
  const { userId } = await auth()
  const isDev = process.env.NODE_ENV === 'development'

  if (!userId && !isDev) {
    redirect('/sign-in')
  }

  let bookings
  let isDemo = false

  if (userId) {
    // Obtener artista autenticado
    const artist = await prisma.artist.findUnique({
      where: { clerkId: userId },
    })

    if (!artist) {
      redirect('/onboarding')
    }

    // Obtener bookings reales
    bookings = await prisma.booking.findMany({
      where: { artistId: artist.id },
      orderBy: { createdAt: 'desc' },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
    })
  } else {
    // Modo demo
    bookings = DEMO_BOOKINGS
    isDemo = true
  }

  return (
    <BookingsClient
      initialBookings={bookings}
      isDemo={isDemo}
    />
  )
}
