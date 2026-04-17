import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { DEMO_BOOKINGS } from '@/lib/mocks/data'
import { BookingList } from '@/components/dashboard/booking-list'

export default async function BookingsPage() {
  const { userId } = await auth()

  // Bypass para development - permite ver la UI sin login
  const isDev = process.env.NODE_ENV === 'development'

  if (!userId && !isDev) {
    redirect('/sign-in')
  }

  // En development sin login, usar datos del mock
  const bookings = DEMO_BOOKINGS

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
        <p className="text-gray-600 mt-2">Manage your appointment requests</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#141414] p-6">
        <BookingList bookings={bookings} />
      </div>
    </div>
  )
}
