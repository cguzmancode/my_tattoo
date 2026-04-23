import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { CalendarClient } from './calendar-client'
import { DEMO_ARTIST, DEMO_BLOCKED_DATES, DEMO_BOOKINGS } from '@/lib/mocks/data'

export default async function CalendarPage() {
  const { userId } = await auth()

  // Bypass para development - permite ver la UI sin login
  const isDev = process.env.NODE_ENV === 'development'

  if (!userId && !isDev) {
    redirect('/sign-in')
  }

  // En development sin login, usar datos del mock
  let artist
  let blockedDates
  let bookings

  if (userId) {
    // Usuario autenticado - usar datos reales de la DB
    artist = await prisma.artist.findUnique({
      where: { clerkId: userId },
    })

    if (!artist) {
      redirect('/sign-up')
    }

    blockedDates = await prisma.blockedDate.findMany({
      where: { artistId: artist.id },
    })

    bookings = await prisma.booking.findMany({
      where: { 
        artistId: artist.id,
        // Incluir todos los estados excepto REJECTED y CANCELLED
        status: { notIn: ['REJECTED', 'CANCELLED'] },
      },
    })
  } else {
    // Development mode - usar datos del mock
    artist = DEMO_ARTIST
    blockedDates = DEMO_BLOCKED_DATES.map((bd) => ({ date: bd.date }))
    bookings = DEMO_BOOKINGS.filter((b) => ['ACCEPTED', 'CONFIRMED'].includes(b.status))
  }

  // Transform bookings to calendar events
  const events = bookings.map((booking) => {
    // Usar proposedDate si existe, si no usar preferredDates[0]
    const proposedDate = (booking as any).proposedDate
    const preferredDates = (booking as any).preferredDates
    
    const eventDate = proposedDate 
      ? new Date(proposedDate) 
      : (preferredDates?.[0] ? new Date(preferredDates[0]) : new Date())
    
    return {
      id: booking.id,
      date: eventDate,
      type: 'booking' as const,
      title: (booking as any).clientName,
      status: (booking as any).status,
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Calendario</h1>
          <p className="mt-1 text-zinc-400">
            Gestiona tu disponibilidad y citas programadas
          </p>
        </div>
      </div>

      <CalendarClient
        events={events}
        blockedDates={blockedDates.map((bd) => new Date(bd.date))}
        artistId={artist.id}
      />
    </div>
  )
}
