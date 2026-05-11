import { describe, it, expect } from 'vitest'
import { BookingId } from './booking-id'
import { BookingMessage, MessageSender } from './booking-message'
import { EmptyMessageError } from './errors'

const VALID_ID = '550e8400-e29b-41d4-a716-446655440000'
const NOW = new Date('2026-05-11T12:00:00Z')

describe('BookingMessage.create', () => {
  it('creates a message with trimmed content and read=false by default', () => {
    const message = BookingMessage.create({
      id: 'msg-1',
      bookingId: BookingId.fromString(VALID_ID),
      sender: MessageSender.CLIENT,
      message: '  Hello!  ',
      createdAt: NOW,
    })
    expect(message.message).toBe('Hello!')
    expect(message.read).toBe(false)
    expect(message.sender).toBe(MessageSender.CLIENT)
  })

  it('rejects empty messages', () => {
    expect(() =>
      BookingMessage.create({
        id: 'msg-1',
        bookingId: BookingId.fromString(VALID_ID),
        sender: MessageSender.ARTIST,
        message: '   ',
        createdAt: NOW,
      }),
    ).toThrow(EmptyMessageError)
  })

  it('preserves the bookingId reference', () => {
    const bookingId = BookingId.fromString(VALID_ID)
    const message = BookingMessage.create({
      id: 'msg-1',
      bookingId,
      sender: MessageSender.ARTIST,
      message: 'hi',
      createdAt: NOW,
    })
    expect(message.bookingId.equals(bookingId)).toBe(true)
  })
})
