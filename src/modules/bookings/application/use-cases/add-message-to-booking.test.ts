import { describe, it, expect, beforeEach } from 'vitest'
import { AddMessageToBookingUseCase } from './add-message-to-booking'
import { InMemoryBookingRepository } from '../../test-support/in-memory-booking-repository'
import { InMemoryBookingMessageRepository } from '../../test-support/in-memory-booking-message-repository'
import { FakeNotificationService } from '../../test-support/fake-notification-service'
import { FixedClock } from '../../test-support/fixed-clock'
import { buildBooking } from '../../test-support/booking-factory'
import { MessageSender } from '../../domain/booking-message'
import {
  BookingNotFoundError,
  EmptyMessageError,
  UnauthorizedBookingAccessError,
} from '../../domain/errors'

const NOW = new Date('2026-05-11T12:00:00Z')
const VALID_ID = '550e8400-e29b-41d4-a716-446655440000'

describe('AddMessageToBookingUseCase', () => {
  let bookings: InMemoryBookingRepository
  let messages: InMemoryBookingMessageRepository
  let notifications: FakeNotificationService
  let useCase: AddMessageToBookingUseCase

  beforeEach(() => {
    bookings = new InMemoryBookingRepository()
    messages = new InMemoryBookingMessageRepository()
    notifications = new FakeNotificationService()
    useCase = new AddMessageToBookingUseCase(
      bookings,
      messages,
      notifications,
      new FixedClock(NOW),
    )
  })

  describe('when sender is ARTIST', () => {
    it('allows the owner artist to add a message', async () => {
      bookings.preload(buildBooking({ artistId: 'owner' }))

      await useCase.execute({
        bookingId: VALID_ID,
        messageId: 'msg-1',
        message: 'On my way',
        sender: 'ARTIST',
        artistId: 'owner',
      })

      expect(messages.all).toHaveLength(1)
      expect(messages.all[0].sender).toBe(MessageSender.ARTIST)
      expect(notifications.calls).toHaveLength(1)
      expect(notifications.calls[0].kind).toBe('message')
    })

    it('blocks an artist that is not the owner', async () => {
      bookings.preload(buildBooking({ artistId: 'owner' }))

      await expect(
        useCase.execute({
          bookingId: VALID_ID,
          messageId: 'msg-1',
          message: 'Intruder here',
          sender: 'ARTIST',
          artistId: 'someone-else',
        }),
      ).rejects.toThrow(UnauthorizedBookingAccessError)

      expect(messages.all).toHaveLength(0)
      expect(notifications.calls).toHaveLength(0)
    })
  })

  describe('when sender is CLIENT', () => {
    it('allows the booking client to add a message', async () => {
      bookings.preload(buildBooking({ clientEmail: 'jane@example.com' }))

      await useCase.execute({
        bookingId: VALID_ID,
        messageId: 'msg-2',
        message: 'Thanks for accepting',
        sender: 'CLIENT',
        clientEmail: 'JANE@example.com',
      })

      expect(messages.all).toHaveLength(1)
      expect(messages.all[0].sender).toBe(MessageSender.CLIENT)
    })

    it('blocks a client with a different email', async () => {
      bookings.preload(buildBooking({ clientEmail: 'jane@example.com' }))

      await expect(
        useCase.execute({
          bookingId: VALID_ID,
          messageId: 'msg-2',
          message: 'I am not Jane',
          sender: 'CLIENT',
          clientEmail: 'bob@example.com',
        }),
      ).rejects.toThrow(UnauthorizedBookingAccessError)

      expect(messages.all).toHaveLength(0)
    })
  })

  it('throws BookingNotFoundError when the booking does not exist', async () => {
    await expect(
      useCase.execute({
        bookingId: VALID_ID,
        messageId: 'msg-1',
        message: 'Hello',
        sender: 'ARTIST',
        artistId: 'owner',
      }),
    ).rejects.toThrow(BookingNotFoundError)
  })

  it('rejects empty messages', async () => {
    bookings.preload(buildBooking({ artistId: 'owner' }))
    await expect(
      useCase.execute({
        bookingId: VALID_ID,
        messageId: 'msg-1',
        message: '   ',
        sender: 'ARTIST',
        artistId: 'owner',
      }),
    ).rejects.toThrow(EmptyMessageError)
  })
})
