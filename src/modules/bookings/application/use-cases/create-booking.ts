import { Booking } from '../../domain/booking'
import { BookingId } from '../../domain/booking-id'
import type { BookingRepository } from '../ports/booking-repository'
import type { NotificationService } from '../ports/notification-service'
import type { Clock } from '../ports/clock'

export interface CreateBookingInput {
  bookingId: string
  artistId: string
  clientName: string
  clientEmail: string
  clientPhone: string | null
  bodyZone: string
  size: string
  description: string
  referenceImages: readonly string[]
  preferredDates: readonly string[]
}

export class CreateBookingUseCase {
  constructor(
    private readonly bookings: BookingRepository,
    private readonly notifications: NotificationService,
    private readonly clock: Clock,
  ) {}

  async execute(input: CreateBookingInput): Promise<void> {
    const booking = Booking.create({
      id: BookingId.fromString(input.bookingId),
      artistId: input.artistId,
      clientName: input.clientName,
      clientEmail: input.clientEmail,
      clientPhone: input.clientPhone,
      bodyZone: input.bodyZone,
      size: input.size,
      description: input.description,
      referenceImages: input.referenceImages,
      preferredDates: input.preferredDates,
      createdAt: this.clock.now(),
    })
    await this.bookings.save(booking)
    await this.notifications.bookingReceived(booking)
  }
}
