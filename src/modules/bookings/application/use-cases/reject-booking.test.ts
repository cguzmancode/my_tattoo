import { describe, it, expect, beforeEach } from 'vitest'
import { RejectBookingUseCase } from './reject-booking'
import { InMemoryBookingRepository } from '../../test-support/in-memory-booking-repository'
import { FakeNotificationService } from '../../test-support/fake-notification-service'
import { FixedClock } from '../../test-support/fixed-clock'
import { buildBooking } from '../../test-support/booking-factory'
import { BookingId } from '../../domain/booking-id'
import { BookingStatus } from '../../domain/booking-status'
import {
  BookingNotFoundError,
  UnauthorizedBookingAccessError,
} from '../../domain/errors'

const NOW = new Date('2026-05-11T12:00:00Z')
const VALID_ID = '550e8400-e29b-41d4-a716-446655440000'

describe('RejectBookingUseCase', () => {
  let bookings: InMemoryBookingRepository
  let notifications: FakeNotificationService
  let useCase: RejectBookingUseCase

  beforeEach(() => {
    bookings = new InMemoryBookingRepository()
    notifications = new FakeNotificationService()
    useCase = new RejectBookingUseCase(bookings, notifications, new FixedClock(NOW))
  })

  it('transitions to REJECTED and notifies', async () => {
    bookings.preload(buildBooking({ artistId: 'owner' }))
    await useCase.execute({ bookingId: VALID_ID, artistId: 'owner' })

    const stored = await bookings.findById(BookingId.fromString(VALID_ID))
    expect(stored!.status).toBe(BookingStatus.REJECTED)
    expect(notifications.calls[0].kind).toBe('rejected')
  })

  it('blocks non-owners', async () => {
    bookings.preload(buildBooking({ artistId: 'owner' }))
    await expect(
      useCase.execute({ bookingId: VALID_ID, artistId: 'intruder' }),
    ).rejects.toThrow(UnauthorizedBookingAccessError)
  })

  it('throws when booking is missing', async () => {
    await expect(
      useCase.execute({ bookingId: VALID_ID, artistId: 'owner' }),
    ).rejects.toThrow(BookingNotFoundError)
  })
})
