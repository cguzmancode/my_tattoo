import { describe, it, expect } from 'vitest'
import { GetArtistBookingsUseCase } from './get-artist-bookings'
import { InMemoryBookingRepository } from '../../test-support/in-memory-booking-repository'
import { buildBooking } from '../../test-support/booking-factory'
import { BookingId } from '../../domain/booking-id'

describe('GetArtistBookingsUseCase', () => {
  it('returns only the bookings owned by the requested artist', async () => {
    const bookings = new InMemoryBookingRepository()
    bookings.preload(
      buildBooking({
        id: BookingId.fromString('11111111-1111-1111-1111-111111111111'),
        artistId: 'owner',
      }),
    )
    bookings.preload(
      buildBooking({
        id: BookingId.fromString('22222222-2222-2222-2222-222222222222'),
        artistId: 'owner',
      }),
    )
    bookings.preload(
      buildBooking({
        id: BookingId.fromString('33333333-3333-3333-3333-333333333333'),
        artistId: 'someone-else',
      }),
    )

    const useCase = new GetArtistBookingsUseCase(bookings)
    const result = await useCase.execute({ artistId: 'owner' })

    expect(result).toHaveLength(2)
    expect(result.every((b) => b.artistId === 'owner')).toBe(true)
  })

  it('returns an empty array when the artist has no bookings', async () => {
    const useCase = new GetArtistBookingsUseCase(new InMemoryBookingRepository())
    expect(await useCase.execute({ artistId: 'whoever' })).toEqual([])
  })
})
