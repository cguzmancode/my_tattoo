import { describe, it, expect, beforeEach } from 'vitest'
import { AcceptBookingUseCase } from './accept-booking'
import { InMemoryBookingRepository } from '../../test-support/in-memory-booking-repository'
import { FakeNotificationService } from '../../test-support/fake-notification-service'
import { FixedClock } from '../../test-support/fixed-clock'
import { buildBooking } from '../../test-support/booking-factory'
import { BookingId } from '../../domain/booking-id'
import { BookingStatus } from '../../domain/booking-status'
import {
  BookingNotFoundError,
  InvalidProposedDateError,
  UnauthorizedBookingAccessError,
} from '../../domain/errors'

const NOW = new Date('2026-05-11T12:00:00Z')
const FUTURE_ISO = '2026-06-01T10:00:00Z'
const PAST_ISO = '2026-04-01T10:00:00Z'
const VALID_ID = '550e8400-e29b-41d4-a716-446655440000'

describe('AcceptBookingUseCase', () => {
  let bookings: InMemoryBookingRepository
  let notifications: FakeNotificationService
  let useCase: AcceptBookingUseCase

  beforeEach(() => {
    bookings = new InMemoryBookingRepository()
    notifications = new FakeNotificationService()
    useCase = new AcceptBookingUseCase(bookings, notifications, new FixedClock(NOW))
  })

  it('transitions to ACCEPTED, persists, and notifies', async () => {
    bookings.preload(buildBooking({ artistId: 'owner' }))

    await useCase.execute({
      bookingId: VALID_ID,
      artistId: 'owner',
      proposedDateISO: FUTURE_ISO,
    })

    const stored = await bookings.findById(BookingId.fromString(VALID_ID))
    expect(stored!.status).toBe(BookingStatus.ACCEPTED)
    expect(stored!.proposedDate?.toISOString()).toBe('2026-06-01T10:00:00.000Z')
    expect(notifications.calls).toHaveLength(1)
    expect(notifications.calls[0].kind).toBe('accepted')
  })

  it('throws BookingNotFoundError when the booking does not exist', async () => {
    await expect(
      useCase.execute({
        bookingId: VALID_ID,
        artistId: 'owner',
        proposedDateISO: FUTURE_ISO,
      }),
    ).rejects.toThrow(BookingNotFoundError)
  })

  it('throws UnauthorizedBookingAccessError when artist is not the owner', async () => {
    bookings.preload(buildBooking({ artistId: 'owner' }))

    await expect(
      useCase.execute({
        bookingId: VALID_ID,
        artistId: 'intruder',
        proposedDateISO: FUTURE_ISO,
      }),
    ).rejects.toThrow(UnauthorizedBookingAccessError)

    const stored = await bookings.findById(BookingId.fromString(VALID_ID))
    expect(stored!.status).toBe(BookingStatus.PENDING)
    expect(notifications.calls).toHaveLength(0)
  })

  it('rejects acceptance with a past proposed date', async () => {
    bookings.preload(buildBooking({ artistId: 'owner' }))

    await expect(
      useCase.execute({
        bookingId: VALID_ID,
        artistId: 'owner',
        proposedDateISO: PAST_ISO,
      }),
    ).rejects.toThrow(InvalidProposedDateError)

    const stored = await bookings.findById(BookingId.fromString(VALID_ID))
    expect(stored!.status).toBe(BookingStatus.PENDING)
  })
})
