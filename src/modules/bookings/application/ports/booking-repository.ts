import type { Booking } from '../../domain/booking'
import type { BookingId } from '../../domain/booking-id'

export interface BookingRepository {
  findById(id: BookingId): Promise<Booking | null>
  findByArtistId(artistId: string): Promise<Booking[]>
  save(booking: Booking): Promise<void>
}
