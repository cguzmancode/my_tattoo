import type { Booking } from '../../domain/booking'
import type { BookingMessage } from '../../domain/booking-message'

export interface NotificationService {
  bookingReceived(booking: Booking): Promise<void>
  bookingAccepted(booking: Booking): Promise<void>
  bookingRejected(booking: Booking): Promise<void>
  newMessage(booking: Booking, message: BookingMessage): Promise<void>
}
