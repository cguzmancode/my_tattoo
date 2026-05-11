import { BookingId } from '../../domain/booking-id'
import {
  BookingNotFoundError,
  UnauthorizedBookingAccessError,
} from '../../domain/errors'
import type { BookingRepository } from '../ports/booking-repository'
import type { NotificationService } from '../ports/notification-service'
import type { Clock } from '../ports/clock'

export interface RejectBookingInput {
  bookingId: string
  artistId: string
}

export class RejectBookingUseCase {
  constructor(
    private readonly bookings: BookingRepository,
    private readonly notifications: NotificationService,
    private readonly clock: Clock,
  ) {}

  async execute(input: RejectBookingInput): Promise<void> {
    const id = BookingId.fromString(input.bookingId)
    const booking = await this.bookings.findById(id)
    if (!booking) throw new BookingNotFoundError(input.bookingId)
    if (!booking.isOwnedBy(input.artistId)) throw new UnauthorizedBookingAccessError()

    const rejected = booking.reject(this.clock.now())
    await this.bookings.save(rejected)
    await this.notifications.bookingRejected(rejected)
  }
}
