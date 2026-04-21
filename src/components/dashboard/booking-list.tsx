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
      <div className="text-center py-12">
        <p className="text-[#a1a1a1]">No bookings yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          data-testid="booking-card"
          onClick={() => onBookingClick?.(booking)}
          className="cursor-pointer"
        >
          <TattooBookingCard
            booking={booking}
            onClick={() => onBookingClick?.(booking)}
          />
        </div>
      ))}
    </div>
  )
}
