import type { BookingId } from './booking-id'
import { EmptyMessageError } from './errors'

export const MessageSender = {
  CLIENT: 'CLIENT',
  ARTIST: 'ARTIST',
} as const
export type MessageSender = (typeof MessageSender)[keyof typeof MessageSender]

export interface BookingMessageProps {
  id: string
  bookingId: BookingId
  sender: MessageSender
  message: string
  createdAt: Date
  read: boolean
}

export class BookingMessage {
  private constructor(private readonly props: BookingMessageProps) {}

  static create(
    input: Omit<BookingMessageProps, 'read'> & { read?: boolean },
  ): BookingMessage {
    const trimmed = input.message.trim()
    if (trimmed.length === 0) {
      throw new EmptyMessageError()
    }
    return new BookingMessage({
      ...input,
      message: trimmed,
      read: input.read ?? false,
    })
  }

  static fromPersistence(props: BookingMessageProps): BookingMessage {
    return new BookingMessage(props)
  }

  get id(): string { return this.props.id }
  get bookingId(): BookingId { return this.props.bookingId }
  get sender(): MessageSender { return this.props.sender }
  get message(): string { return this.props.message }
  get createdAt(): Date { return this.props.createdAt }
  get read(): boolean { return this.props.read }
}
