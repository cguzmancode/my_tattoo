import type { BookingId } from '../../domain/booking-id'
import type { BookingMessage } from '../../domain/booking-message'

export interface BookingMessageRepository {
  add(message: BookingMessage): Promise<void>
  findByBookingId(bookingId: BookingId): Promise<BookingMessage[]>
}
