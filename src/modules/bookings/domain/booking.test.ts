import { describe, it, expect } from 'vitest'
import { Booking, type NewBookingProps } from './booking'
import { BookingId } from './booking-id'
import { BookingStatus } from './booking-status'
import { ProposedDate } from './proposed-date'
import { InvalidStatusTransitionError } from './errors'

const NOW = new Date('2026-05-11T12:00:00Z')
const LATER = new Date('2026-05-12T12:00:00Z')
const FUTURE = new Date('2026-06-01T10:00:00Z')

function newBookingInput(overrides: Partial<NewBookingProps> = {}): NewBookingProps {
  return {
    id: BookingId.fromString('550e8400-e29b-41d4-a716-446655440000'),
    artistId: 'artist-clerk-id-1',
    clientName: 'Jane Doe',
    clientEmail: 'jane@example.com',
    clientPhone: null,
    bodyZone: 'forearm',
    size: 'medium',
    description: 'A small geometric design',
    referenceImages: [],
    preferredDates: ['2026-06-01'],
    createdAt: NOW,
    ...overrides,
  }
}

describe('Booking.create', () => {
  it('starts in PENDING with no proposed date', () => {
    const booking = Booking.create(newBookingInput())
    expect(booking.status).toBe(BookingStatus.PENDING)
    expect(booking.proposedDate).toBeNull()
    expect(booking.createdAt).toEqual(NOW)
    expect(booking.updatedAt).toEqual(NOW)
  })

  it('preserves the client data passed in', () => {
    const booking = Booking.create(newBookingInput({ clientName: 'Bruce' }))
    expect(booking.clientName).toBe('Bruce')
  })
})

describe('Booking ownership', () => {
  it('isOwnedBy returns true for the artist that created it', () => {
    const booking = Booking.create(newBookingInput({ artistId: 'owner' }))
    expect(booking.isOwnedBy('owner')).toBe(true)
    expect(booking.isOwnedBy('intruder')).toBe(false)
  })
})

describe('Booking.accept', () => {
  it('transitions PENDING to ACCEPTED and sets the proposed date', () => {
    const booking = Booking.create(newBookingInput())
    const proposed = ProposedDate.fromDate(FUTURE, NOW)
    const accepted = booking.accept(LATER, proposed)

    expect(accepted.status).toBe(BookingStatus.ACCEPTED)
    expect(accepted.proposedDate?.equals(proposed)).toBe(true)
    expect(accepted.updatedAt).toEqual(LATER)
  })

  it('does not mutate the original booking (immutability)', () => {
    const booking = Booking.create(newBookingInput())
    const proposed = ProposedDate.fromDate(FUTURE, NOW)
    booking.accept(LATER, proposed)
    expect(booking.status).toBe(BookingStatus.PENDING)
    expect(booking.proposedDate).toBeNull()
  })

  it('rejects acceptance from non-PENDING states', () => {
    const proposed = ProposedDate.fromDate(FUTURE, NOW)
    const accepted = Booking.create(newBookingInput()).accept(LATER, proposed)
    expect(() => accepted.accept(LATER, proposed)).toThrow(InvalidStatusTransitionError)
  })
})

describe('Booking.reject', () => {
  it('transitions PENDING to REJECTED', () => {
    const booking = Booking.create(newBookingInput())
    const rejected = booking.reject(LATER)
    expect(rejected.status).toBe(BookingStatus.REJECTED)
    expect(rejected.updatedAt).toEqual(LATER)
  })

  it('cannot be rejected once accepted', () => {
    const proposed = ProposedDate.fromDate(FUTURE, NOW)
    const accepted = Booking.create(newBookingInput()).accept(LATER, proposed)
    expect(() => accepted.reject(LATER)).toThrow(InvalidStatusTransitionError)
  })
})

describe('Booking.confirm', () => {
  it('transitions ACCEPTED to CONFIRMED', () => {
    const proposed = ProposedDate.fromDate(FUTURE, NOW)
    const accepted = Booking.create(newBookingInput()).accept(LATER, proposed)
    const confirmed = accepted.confirm(LATER)
    expect(confirmed.status).toBe(BookingStatus.CONFIRMED)
  })

  it('cannot be confirmed directly from PENDING', () => {
    const booking = Booking.create(newBookingInput())
    expect(() => booking.confirm(LATER)).toThrow(InvalidStatusTransitionError)
  })
})

describe('Booking.complete', () => {
  it('transitions CONFIRMED to COMPLETED', () => {
    const proposed = ProposedDate.fromDate(FUTURE, NOW)
    const completed = Booking.create(newBookingInput())
      .accept(LATER, proposed)
      .confirm(LATER)
      .complete(LATER)
    expect(completed.status).toBe(BookingStatus.COMPLETED)
  })

  it('cannot be completed from PENDING', () => {
    const booking = Booking.create(newBookingInput())
    expect(() => booking.complete(LATER)).toThrow(InvalidStatusTransitionError)
  })
})

describe('Booking.cancel', () => {
  it('can be cancelled from PENDING, ACCEPTED and CONFIRMED', () => {
    const proposed = ProposedDate.fromDate(FUTURE, NOW)
    const pending = Booking.create(newBookingInput())
    expect(pending.cancel(LATER).status).toBe(BookingStatus.CANCELLED)
    expect(pending.accept(LATER, proposed).cancel(LATER).status).toBe(BookingStatus.CANCELLED)
    expect(pending.accept(LATER, proposed).confirm(LATER).cancel(LATER).status).toBe(BookingStatus.CANCELLED)
  })

  it('cannot be cancelled from terminal states', () => {
    const proposed = ProposedDate.fromDate(FUTURE, NOW)
    const completed = Booking.create(newBookingInput())
      .accept(LATER, proposed)
      .confirm(LATER)
      .complete(LATER)
    expect(() => completed.cancel(LATER)).toThrow(InvalidStatusTransitionError)

    const rejected = Booking.create(newBookingInput()).reject(LATER)
    expect(() => rejected.cancel(LATER)).toThrow(InvalidStatusTransitionError)
  })
})

describe('Booking.fromPersistence', () => {
  it('reconstructs a Booking from raw props without applying creation defaults', () => {
    const proposed = ProposedDate.fromDate(FUTURE, NOW)
    const booking = Booking.fromPersistence({
      id: BookingId.fromString('550e8400-e29b-41d4-a716-446655440000'),
      artistId: 'artist-1',
      clientName: 'Jane',
      clientEmail: 'jane@example.com',
      clientPhone: null,
      bodyZone: 'arm',
      size: 'large',
      description: 'A piece',
      referenceImages: [],
      preferredDates: [],
      status: BookingStatus.CONFIRMED,
      proposedDate: proposed,
      priceEstimate: 25000,
      durationEstimate: '3h',
      artistNotes: 'Bring reference',
      createdAt: NOW,
      updatedAt: LATER,
    })
    expect(booking.status).toBe(BookingStatus.CONFIRMED)
    expect(booking.priceEstimate).toBe(25000)
  })
})
