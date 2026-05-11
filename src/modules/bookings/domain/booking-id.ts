import { InvalidBookingIdError } from './errors'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export class BookingId {
  private constructor(public readonly value: string) {}

  static fromString(value: string): BookingId {
    if (!UUID_PATTERN.test(value)) {
      throw new InvalidBookingIdError(value)
    }
    return new BookingId(value.toLowerCase())
  }

  equals(other: BookingId): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
