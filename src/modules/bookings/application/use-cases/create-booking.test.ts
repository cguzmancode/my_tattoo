import { describe, it, expect, beforeEach } from 'vitest'
import { CreateBookingUseCase } from './create-booking'
import { InMemoryBookingRepository } from '../../test-support/in-memory-booking-repository'
import { FakeNotificationService } from '../../test-support/fake-notification-service'
import { FixedClock } from '../../test-support/fixed-clock'
import { BookingStatus } from '../../domain/booking-status'
import { BookingId } from '../../domain/booking-id'
import { InvalidBookingIdError } from '../../domain/errors'

const NOW = new Date('2026-05-11T12:00:00Z')
const VALID_ID = '550e8400-e29b-41d4-a716-446655440000'

describe('CreateBookingUseCase', () => {
  let bookings: InMemoryBookingRepository
  let notifications: FakeNotificationService
  let useCase: CreateBookingUseCase

  beforeEach(() => {
    bookings = new InMemoryBookingRepository()
    notifications = new FakeNotificationService()
    useCase = new CreateBookingUseCase(bookings, notifications, new FixedClock(NOW))
  })

  it('persists a PENDING booking and notifies that it was received', async () => {
    await useCase.execute({
      bookingId: VALID_ID,
      artistId: 'artist-1',
      clientName: 'Jane',
      clientEmail: 'jane@example.com',
      clientPhone: null,
      bodyZone: 'arm',
      size: 'small',
      description: 'A geometric shape',
      referenceImages: [],
      preferredDates: ['2026-06-01'],
    })

    const stored = await bookings.findById(BookingId.fromString(VALID_ID))
    expect(stored).not.toBeNull()
    expect(stored!.status).toBe(BookingStatus.PENDING)
    expect(stored!.createdAt).toEqual(NOW)
    expect(notifications.calls).toHaveLength(1)
    expect(notifications.calls[0].kind).toBe('received')
  })

  it('rejects invalid booking ids', async () => {
    await expect(
      useCase.execute({
        bookingId: 'not-a-uuid',
        artistId: 'artist-1',
        clientName: 'Jane',
        clientEmail: 'jane@example.com',
        clientPhone: null,
        bodyZone: 'arm',
        size: 'small',
        description: 'A geometric shape',
        referenceImages: [],
        preferredDates: [],
      }),
    ).rejects.toThrow(InvalidBookingIdError)
    expect(bookings.size).toBe(0)
    expect(notifications.calls).toHaveLength(0)
  })
})
