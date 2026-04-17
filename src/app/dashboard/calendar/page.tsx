import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { CalendarView } from '@/components/calendar/calendar-view'
import { blockDate, unblockDate } from '@/app/actions/calendar'

export default async function CalendarPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const artist = await prisma.artist.findUnique({
    where: { clerkId: userId },
  })

  if (!artist) {
    redirect('/sign-up')
  }

  // Fetch blocked dates and bookings for this month
  const blockedDates = await prisma.blockedDate.findMany({
    where: { artistId: artist.id },
  })

  const bookings = await prisma.booking.findMany({
    where: {
      artistId: artist.id,
      status: { in: ['ACCEPTED', 'CONFIRMED'] },
    },
  })

  // Transform bookings to calendar events
  const events = bookings.map((booking) => ({
    id: booking.id,
    date: booking.preferredDates[0] ? new Date(booking.preferredDates[0]) : new Date(),
    type: 'booking' as const,
    title: booking.clientName,
    status: booking.status,
  }))

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

      <CalendarView
        events={events}
        blockedDates={blockedDates.map((bd) => bd.date)}
      />
    </div>
  )
}
