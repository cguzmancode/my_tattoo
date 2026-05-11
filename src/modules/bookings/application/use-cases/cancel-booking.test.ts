import { describe, it, expect, beforeEach } from 'vitest'
import { CancelBookingUseCase } from './cancel-booking'
import { InMemoryBookingRepository } from '../../test-support/in-memory-booking-repository'
import { FixedClock } from '../../test-support/fixed-clock'
import { buildBooking } from '../../test-support/booking-factory'
import { BookingId } from '../../domain/booking-id'
import { BookingStatus } from '../../domain/booking-status'
import { UnauthorizedBookingAccessError } from '../../domain/errors'

const NOW = new Date('2026-05-11T12:00:00Z')
const VALID_ID = '550e8400-e29b-41d4-a716-446655440000'

describe('CancelBookingUseCase', () => {
  let bookings: InMemoryBookingRepository
  let useCase: CancelBookingUseCase

  beforeEach(() => {
    bookings = new InMemoryBookingRepository()
    useCase = new CancelBookingUseCase(bookings, new FixedClock(NOW))
  })

  it('cancels a pending booking', async () => {
    bookings.preload(buildBooking({ artistId: 'owner' }))
    await useCase.execute({ bookingId: VALID_ID, artistId: 'owner' })
    const stored = await bookings.findById(BookingId.fromString(VALID_ID))
    expect(stored!.status).toBe(BookingStatus.CANCELLED)
  })

  it('blocks non-owners', async () => {
    bookings.preload(buildBooking({ artistId: 'owner' }))
    await expect(
      useCase.execute({ bookingId: VALID_ID, artistId: 'intruder' }),
    ).rejects.toThrow(UnauthorizedBookingAccessError)
  })
})
