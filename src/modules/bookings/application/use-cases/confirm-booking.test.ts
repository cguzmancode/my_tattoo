import { describe, it, expect, beforeEach } from 'vitest'
import { ConfirmBookingUseCase } from './confirm-booking'
import { AcceptBookingUseCase } from './accept-booking'
import { InMemoryBookingRepository } from '../../test-support/in-memory-booking-repository'
import { FakeNotificationService } from '../../test-support/fake-notification-service'
import { FixedClock } from '../../test-support/fixed-clock'
import { buildBooking } from '../../test-support/booking-factory'
import { BookingId } from '../../domain/booking-id'
import { BookingStatus } from '../../domain/booking-status'
import { InvalidStatusTransitionError } from '../../domain/errors'

const NOW = new Date('2026-05-11T12:00:00Z')
const FUTURE_ISO = '2026-06-01T10:00:00Z'
const VALID_ID = '550e8400-e29b-41d4-a716-446655440000'

describe('ConfirmBookingUseCase', () => {
  let bookings: InMemoryBookingRepository
  let notifications: FakeNotificationService
  let clock: FixedClock
  let confirmUseCase: ConfirmBookingUseCase
  let acceptUseCase: AcceptBookingUseCase

  beforeEach(() => {
    bookings = new InMemoryBookingRepository()
    notifications = new FakeNotificationService()
    clock = new FixedClock(NOW)
    confirmUseCase = new ConfirmBookingUseCase(bookings, clock)
    acceptUseCase = new AcceptBookingUseCase(bookings, notifications, clock)
  })

  it('marks deposit as paid and transitions to CONFIRMED', async () => {
    bookings.preload(buildBooking({ artistId: 'owner' }))
    await acceptUseCase.execute({
      bookingId: VALID_ID,
      artistId: 'owner',
      proposedDateISO: FUTURE_ISO,
    })

    await confirmUseCase.execute({ bookingId: VALID_ID, artistId: 'owner' })

    const stored = await bookings.findById(BookingId.fromString(VALID_ID))
    expect(stored!.status).toBe(BookingStatus.CONFIRMED)
    expect(stored!.depositPaid).toBe(true)
  })

  it('rejects confirmation from PENDING', async () => {
    bookings.preload(buildBooking({ artistId: 'owner' }))
    await expect(
      confirmUseCase.execute({ bookingId: VALID_ID, artistId: 'owner' }),
    ).rejects.toThrow(InvalidStatusTransitionError)
  })
})
