import type { Booking } from '../domain/booking'
import type { BookingMessage } from '../domain/booking-message'
import type { NotificationService } from '../application/ports/notification-service'

export type NotificationCall =
  | { kind: 'received'; booking: Booking }
  | { kind: 'accepted'; booking: Booking }
  | { kind: 'rejected'; booking: Booking }
  | { kind: 'message'; booking: Booking; message: BookingMessage }

export class FakeNotificationService implements NotificationService {
  readonly calls: NotificationCall[] = []

  async bookingReceived(booking: Booking): Promise<void> {
    this.calls.push({ kind: 'received', booking })
  }

  async bookingAccepted(booking: Booking): Promise<void> {
    this.calls.push({ kind: 'accepted', booking })
  }

  async bookingRejected(booking: Booking): Promise<void> {
    this.calls.push({ kind: 'rejected', booking })
  }

  async newMessage(booking: Booking, message: BookingMessage): Promise<void> {
    this.calls.push({ kind: 'message', booking, message })
  }
}
