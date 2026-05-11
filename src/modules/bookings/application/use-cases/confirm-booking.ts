import { BookingId } from '../../domain/booking-id'
import {
  BookingNotFoundError,
  UnauthorizedBookingAccessError,
} from '../../domain/errors'
import type { BookingRepository } from '../ports/booking-repository'
import type { Clock } from '../ports/clock'

export interface ConfirmBookingInput {
  bookingId: string
  artistId: string
}

export class ConfirmBookingUseCase {
  constructor(
    private readonly bookings: BookingRepository,
    private readonly clock: Clock,
  ) {}

  async execute(input: ConfirmBookingInput): Promise<void> {
    const id = BookingId.fromString(input.bookingId)
    const booking = await this.bookings.findById(id)
    if (!booking) throw new BookingNotFoundError(input.bookingId)
    if (!booking.isOwnedBy(input.artistId)) throw new UnauthorizedBookingAccessError()

    const confirmed = booking.confirm(this.clock.now())
    await this.bookings.save(confirmed)
  }
}
