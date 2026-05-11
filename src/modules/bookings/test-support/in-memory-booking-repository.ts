import type { Booking } from '../domain/booking'
import type { BookingId } from '../domain/booking-id'
import type { BookingRepository } from '../application/ports/booking-repository'

export class InMemoryBookingRepository implements BookingRepository {
  private readonly store = new Map<string, Booking>()

  async findById(id: BookingId): Promise<Booking | null> {
    return this.store.get(id.value) ?? null
  }

  async findByArtistId(artistId: string): Promise<Booking[]> {
    return Array.from(this.store.values()).filter((b) => b.artistId === artistId)
  }

  async save(booking: Booking): Promise<void> {
    this.store.set(booking.id.value, booking)
  }

  preload(booking: Booking): void {
    this.store.set(booking.id.value, booking)
  }

  get size(): number {
    return this.store.size
  }
}
