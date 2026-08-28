// Shared contract for everything the dashboard renders.
//
// The dashboard receives bookings from two sources with the same shape:
// Prisma queries in production and the demo fixtures in src/lib/mocks.
// Deriving these types from the Prisma Client (instead of re-declaring them
// by hand in each client component) makes the compiler enforce that both
// sources stay in sync — the mocks declare `satisfies` against these types.
import type { Artist, Booking, BookingMessage } from '@prisma/client'

export type DashboardArtist = Artist

export type DashboardMessage = BookingMessage

export type DashboardBooking = Booking & {
  /** Presentation-only field used by the demo fixtures; not persisted. */
  style?: string
  /** Present when the query includes the messages relation. */
  messages?: BookingMessage[]
}

export interface DashboardStats {
  totalBookings: number
  pendingBookings: number
  acceptedBookings: number
  confirmedBookings: number
  cancelledBookings: number
  thisWeek: number
  thisMonth: number
}
