import type { BookingId } from '../domain/booking-id'
import type { BookingMessage } from '../domain/booking-message'
import type { BookingMessageRepository } from '../application/ports/booking-message-repository'

export class InMemoryBookingMessageRepository implements BookingMessageRepository {
  private readonly store: BookingMessage[] = []

  async add(message: BookingMessage): Promise<void> {
    this.store.push(message)
  }

  async findByBookingId(bookingId: BookingId): Promise<BookingMessage[]> {
    return this.store.filter((m) => m.bookingId.equals(bookingId))
  }

  get all(): readonly BookingMessage[] {
    return this.store
  }
}
