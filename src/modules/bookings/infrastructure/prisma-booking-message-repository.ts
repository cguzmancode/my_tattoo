import type { PrismaClient } from '@prisma/client'
import { BookingId } from '../domain/booking-id'
import { BookingMessage, MessageSender } from '../domain/booking-message'
import type { BookingMessageRepository } from '../application/ports/booking-message-repository'

export class PrismaBookingMessageRepository implements BookingMessageRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async add(message: BookingMessage): Promise<void> {
    await this.prisma.bookingMessage.create({
      data: {
        id: message.id,
        bookingId: message.bookingId.value,
        sender: message.sender === MessageSender.ARTIST ? 'artist' : 'client',
        message: message.message,
        createdAt: message.createdAt,
        read: message.read,
      },
    })
  }

  async findByBookingId(bookingId: BookingId): Promise<BookingMessage[]> {
    const rows = await this.prisma.bookingMessage.findMany({
      where: { bookingId: bookingId.value },
      orderBy: { createdAt: 'asc' },
    })
    return rows.map((row) =>
      BookingMessage.fromPersistence({
        id: row.id,
        bookingId,
        sender: row.sender === 'artist' ? MessageSender.ARTIST : MessageSender.CLIENT,
        message: row.message,
        createdAt: row.createdAt,
        read: row.read,
      }),
    )
  }
}
