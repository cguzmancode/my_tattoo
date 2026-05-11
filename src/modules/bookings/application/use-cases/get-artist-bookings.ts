import type { Booking } from '../../domain/booking'
import type { BookingRepository } from '../ports/booking-repository'

export interface GetArtistBookingsInput {
  artistId: string
}

export class GetArtistBookingsUseCase {
  constructor(private readonly bookings: BookingRepository) {}

  async execute(input: GetArtistBookingsInput): Promise<readonly Booking[]> {
    return this.bookings.findByArtistId(input.artistId)
  }
}
