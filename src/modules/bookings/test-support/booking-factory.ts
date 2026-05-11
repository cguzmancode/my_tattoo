import { Booking, type NewBookingProps } from '../domain/booking'
import { BookingId } from '../domain/booking-id'

const DEFAULT_NOW = new Date('2026-05-11T12:00:00Z')

export function buildBooking(overrides: Partial<NewBookingProps> = {}): Booking {
  return Booking.create({
    id: BookingId.fromString('550e8400-e29b-41d4-a716-446655440000'),
    artistId: 'artist-1',
    clientName: 'Jane Doe',
    clientEmail: 'jane@example.com',
    clientPhone: null,
    bodyZone: 'forearm',
    size: 'medium',
    description: 'A small geometric design',
    referenceImages: [],
    preferredDates: ['2026-06-01'],
    createdAt: DEFAULT_NOW,
    ...overrides,
  })
}
