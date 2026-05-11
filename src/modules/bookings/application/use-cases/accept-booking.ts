import { BookingId } from '../../domain/booking-id'
import { ProposedDate } from '../../domain/proposed-date'
import {
  BookingNotFoundError,
  UnauthorizedBookingAccessError,
} from '../../domain/errors'
import type { BookingRepository } from '../ports/booking-repository'
import type { NotificationService } from '../ports/notification-service'
import type { Clock } from '../ports/clock'

export interface AcceptBookingInput {
  bookingId: string
  artistId: string
  proposedDateISO: string
}

export class AcceptBookingUseCase {
  constructor(
    private readonly bookings: BookingRepository,
    private readonly notifications: NotificationService,
    private readonly clock: Clock,
  ) {}

  async execute(input: AcceptBookingInput): Promise<void> {
    const now = this.clock.now()
    const id = BookingId.fromString(input.bookingId)
    const booking = await this.bookings.findById(id)
    if (!booking) throw new BookingNotFoundError(input.bookingId)
    if (!booking.isOwnedBy(input.artistId)) throw new UnauthorizedBookingAccessError()

    const proposedDate = ProposedDate.fromISOString(input.proposedDateISO, now)
    const accepted = booking.accept(now, proposedDate)

    await this.bookings.save(accepted)
    await this.notifications.bookingAccepted(accepted)
  }
}
