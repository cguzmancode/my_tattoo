import { DEMO_BOOKINGS } from '@/lib/mocks/data'
import { TattooBookingCard } from './tattoo-booking-card'

interface Booking {
  id: string
  clientName: string
  clientEmail: string
  bodyZone: string
  size: string
  description: string
  status: 'PENDING' | 'ACCEPTED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  createdAt: Date | string
}

interface BookingListProps {
  bookings?: Booking[]
  onBookingClick?: (booking: Booking) => void
}

export function BookingList({ bookings = DEMO_BOOKINGS as Booking[], onBookingClick }: BookingListProps) {
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
