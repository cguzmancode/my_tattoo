import { describe, it, expect } from 'vitest'
import { CompleteBookingUseCase } from './complete-booking'
import { AcceptBookingUseCase } from './accept-booking'
import { ConfirmBookingUseCase } from './confirm-booking'
import { InMemoryBookingRepository } from '../../test-support/in-memory-booking-repository'
import { FakeNotificationService } from '../../test-support/fake-notification-service'
import { FixedClock } from '../../test-support/fixed-clock'
import { buildBooking } from '../../test-support/booking-factory'
import { BookingId } from '../../domain/booking-id'
import { BookingStatus } from '../../domain/booking-status'

const NOW = new Date('2026-05-11T12:00:00Z')
const FUTURE_ISO = '2026-06-01T10:00:00Z'
const VALID_ID = '550e8400-e29b-41d4-a716-446655440000'

describe('CompleteBookingUseCase', () => {
  it('completes a confirmed booking', async () => {
    const bookings = new InMemoryBookingRepository()
    const notifications = new FakeNotificationService()
    const clock = new FixedClock(NOW)
    bookings.preload(buildBooking({ artistId: 'owner' }))

    await new AcceptBookingUseCase(bookings, notifications, clock).execute({
      bookingId: VALID_ID,
      artistId: 'owner',
      proposedDateISO: FUTURE_ISO,
    })
    await new ConfirmBookingUseCase(bookings, clock).execute({
      bookingId: VALID_ID,
      artistId: 'owner',
    })
    await new CompleteBookingUseCase(bookings, clock).execute({
      bookingId: VALID_ID,
      artistId: 'owner',
    })

    const stored = await bookings.findById(BookingId.fromString(VALID_ID))
    expect(stored!.status).toBe(BookingStatus.COMPLETED)
  })
})
