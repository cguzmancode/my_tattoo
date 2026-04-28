import { MockBooking } from '@/lib/mocks'
import { TattooBookingCard } from './tattoo-booking-card'

interface BookingListProps {
  bookings?: MockBooking[]
  onBookingClick?: (booking: MockBooking) => void
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
