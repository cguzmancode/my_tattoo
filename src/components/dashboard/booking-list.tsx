import type { DashboardBooking } from '@/types/dashboard'
import { TattooBookingCard } from './tattoo-booking-card'

interface BookingListProps {
  bookings?: DashboardBooking[]
  onBookingClick?: (booking: DashboardBooking) => void
}

export function BookingList({
  bookings = [],
  onBookingClick
}: BookingListProps) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12" role="status" aria-live="polite">
        <p className="text-[#a1a1a1]">No bookings yet</p>
      </div>
    )
  }

  return (
    <ul className="space-y-4" role="list" aria-label="Lista de reservas">
      {bookings.map((booking) => (
        <li key={booking.id}>
          <TattooBookingCard
            booking={booking}
            onClick={() => onBookingClick?.(booking)}
          />
        </li>
      ))}
    </ul>
  )
}
