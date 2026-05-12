import { Suspense } from 'react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DashboardClient } from './dashboard-client'
import { DashboardSkeleton } from '@/components/ui/skeleton'
import { DEMO_BOOKINGS, DEMO_STATS, DEMO_ARTIST } from '@/lib/mocks'

export default async function DashboardPage() {
  const { userId } = await auth()
  const isDev = process.env.NODE_ENV === 'development'

  // Si no hay userId y no estamos en dev, redirigir a sign-in
  if (!userId && !isDev) {
    redirect('/sign-in')
  }

  let artist
  let bookings
  let stats

  if (userId) {
    // Usuario autenticado - obtener datos reales
    artist = await prisma.artist.findUnique({
      where: { clerkId: userId },
    })

    if (!artist) {
      // El webhook de Clerk debería haber creado el artista
      // Si no existe, redirigir a onboarding
      redirect('/onboarding')
    }

  // Obtener bookings reales
  bookings = await prisma.booking.findMany({
    where: { artistId: artist.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      messages: { orderBy: { createdAt: 'asc' } },
    },
  })

    // Calcular estadísticas reales
    const [
      totalBookings,
      pendingBookings,
      acceptedBookings,
      confirmedBookings,
      cancelledBookings,
    ] = await Promise.all([
      prisma.booking.count({ where: { artistId: artist.id } }),
      prisma.booking.count({ where: { artistId: artist.id, status: 'PENDING' } }),
      prisma.booking.count({ where: { artistId: artist.id, status: 'ACCEPTED' } }),
      prisma.booking.count({ where: { artistId: artist.id, status: 'CONFIRMED' } }),
      prisma.booking.count({ where: { artistId: artist.id, status: 'CANCELLED' } }),
    ])

    // Calcular citas esta semana
    const now = new Date()
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
    startOfWeek.setHours(0, 0, 0, 0)
    const thisWeek = await prisma.booking.count({
      where: {
        artistId: artist.id,
        createdAt: { gte: startOfWeek },
      },
    })

    // Calcular citas este mes
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const thisMonth = await prisma.booking.count({
      where: {
        artistId: artist.id,
        createdAt: { gte: startOfMonth },
      },
    })

    stats = {
      totalBookings,
      pendingBookings,
      acceptedBookings,
      confirmedBookings,
      cancelledBookings,
      thisWeek,
      thisMonth,
    }
  } else {
    // Modo development - usar datos mock
    artist = DEMO_ARTIST
    bookings = DEMO_BOOKINGS.slice(0, 5)
    stats = DEMO_STATS
  }

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardClient
        artist={artist as any}
        bookings={bookings as any[]}
        stats={stats}
        isDemo={!userId}
      />
    </Suspense>
  )
}
