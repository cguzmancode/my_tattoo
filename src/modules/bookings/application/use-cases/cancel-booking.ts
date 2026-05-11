import { BookingId } from '../../domain/booking-id'
import {
  BookingNotFoundError,
  UnauthorizedBookingAccessError,
} from '../../domain/errors'
import type { BookingRepository } from '../ports/booking-repository'
import type { Clock } from '../ports/clock'

export interface CancelBookingInput {
  bookingId: string
  artistId: string
}

export class CancelBookingUseCase {
  constructor(
    private readonly bookings: BookingRepository,
    private readonly clock: Clock,
  ) {}

  async execute(input: CancelBookingInput): Promise<void> {
    const id = BookingId.fromString(input.bookingId)
    const booking = await this.bookings.findById(id)
    if (!booking) throw new BookingNotFoundError(input.bookingId)
    if (!booking.isOwnedBy(input.artistId)) throw new UnauthorizedBookingAccessError()

    const cancelled = booking.cancel(this.clock.now())
    await this.bookings.save(cancelled)
  }
}
