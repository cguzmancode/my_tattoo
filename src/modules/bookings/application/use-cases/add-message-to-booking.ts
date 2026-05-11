import { BookingId } from '../../domain/booking-id'
import { BookingMessage, MessageSender } from '../../domain/booking-message'
import {
  BookingNotFoundError,
  UnauthorizedBookingAccessError,
} from '../../domain/errors'
import type { BookingRepository } from '../ports/booking-repository'
import type { BookingMessageRepository } from '../ports/booking-message-repository'
import type { NotificationService } from '../ports/notification-service'
import type { Clock } from '../ports/clock'

export type AddMessageInput =
  | {
      bookingId: string
      messageId: string
      message: string
      sender: 'ARTIST'
      artistId: string
    }
  | {
      bookingId: string
      messageId: string
      message: string
      sender: 'CLIENT'
      clientEmail: string
    }

export class AddMessageToBookingUseCase {
  constructor(
    private readonly bookings: BookingRepository,
    private readonly messages: BookingMessageRepository,
    private readonly notifications: NotificationService,
    private readonly clock: Clock,
  ) {}

  async execute(input: AddMessageInput): Promise<void> {
    const id = BookingId.fromString(input.bookingId)
    const booking = await this.bookings.findById(id)
    if (!booking) throw new BookingNotFoundError(input.bookingId)

    if (input.sender === 'ARTIST') {
      if (!booking.isOwnedBy(input.artistId)) {
        throw new UnauthorizedBookingAccessError()
      }
    } else {
      const incoming = input.clientEmail.trim().toLowerCase()
      const stored = booking.clientEmail.trim().toLowerCase()
      if (incoming !== stored) {
        throw new UnauthorizedBookingAccessError()
      }
    }

    const message = BookingMessage.create({
      id: input.messageId,
      bookingId: id,
      sender:
        input.sender === 'ARTIST' ? MessageSender.ARTIST : MessageSender.CLIENT,
      message: input.message,
      createdAt: this.clock.now(),
    })

    await this.messages.add(message)
    await this.notifications.newMessage(booking, message)
  }
}
