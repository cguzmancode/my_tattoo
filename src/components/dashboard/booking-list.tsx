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

// Configuración de badges por estado - estilo oscuro tattoo
const statusConfig = {
  PENDING: {
    bg: 'bg-[#eab308]/10',
    text: 'text-[#eab308]',
    border: 'border-[#eab308]/30',
  },
  ACCEPTED: {
    bg: 'bg-[#00d4ff]/10',
    text: 'text-[#00d4ff]',
    border: 'border-[#00d4ff]/30',
  },
  CONFIRMED: {
    bg: 'bg-[#22c55e]/10',
    text: 'text-[#22c55e]',
    border: 'border-[#22c55e]/30',
  },
  CANCELLED: {
    bg: 'bg-[#ef4444]/10',
    text: 'text-[#ef4444]',
    border: 'border-[#ef4444]/30',
  },
  COMPLETED: {
    bg: 'bg-[#525252]/20',
    text: 'text-[#a1a1a1]',
    border: 'border-white/10',
  },
}

export function BookingList({ bookings = DEMO_BOOKINGS as Booking[] }: BookingListProps) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#a1a1a1]">No bookings yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const config = statusConfig[booking.status]
        return (
          <div
            key={booking.id}
            className="rounded-xl border border-white/10 bg-[#141414] p-5 hover:border-[#ff6b35]/30 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                {/* Avatar con gradiente */}
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#c0a062] flex items-center justify-center text-black font-bold text-lg">
                  {booking.clientName.charAt(0)}
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-white group-hover:text-[#ff6b35] transition-colors">
                    {booking.clientName}
                  </h3>
                  <p className="text-[#a1a1a1] text-sm">{booking.clientEmail}</p>
                  <div className="mt-2 text-sm text-[#525252]">
                    <span>{booking.bodyZone}</span>
                    <span className="mx-2">•</span>
                    <span>{booking.size}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${config.bg} ${config.text} ${config.border}`}
                >
                  {booking.status}
                </span>
                <p className="text-xs text-[#525252] mt-1">
                  {formatDistanceToNow(booking.createdAt)}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
