import { DEMO_BOOKINGS } from '@/lib/mocks/data'
import { formatDistanceToNow } from '@/lib/utils'

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
}

export function BookingList({ bookings = DEMO_BOOKINGS as Booking[] }: BookingListProps) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No bookings yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{booking.clientName}</h3>
              <p className="text-gray-600 text-sm">{booking.clientEmail}</p>
              <div className="mt-2 text-sm text-gray-500">
                <span>{booking.bodyZone}</span>
                <span className="mx-2">•</span>
                <span>{booking.size}</span>
              </div>
            </div>
            <div className="text-right">
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  booking.status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-800'
                    : booking.status === 'ACCEPTED'
                      ? 'bg-blue-100 text-blue-800'
                      : booking.status === 'CONFIRMED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                }`}
              >
                {booking.status}
              </span>
              <p className="text-xs text-gray-400 mt-1">
                {formatDistanceToNow(booking.createdAt)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
