import { describe, it, expect } from 'vitest'
import { BookingId } from './booking-id'
import { InvalidBookingIdError } from './errors'

describe('BookingId', () => {
  const validUuid = '550e8400-e29b-41d4-a716-446655440000'

  it('accepts a valid UUID', () => {
    const id = BookingId.fromString(validUuid)
    expect(id.value).toBe(validUuid)
  })

  it('normalizes case to lowercase', () => {
    const id = BookingId.fromString(validUuid.toUpperCase())
    expect(id.value).toBe(validUuid)
  })

  it('rejects strings that are not UUIDs', () => {
    expect(() => BookingId.fromString('not-a-uuid')).toThrow(InvalidBookingIdError)
    expect(() => BookingId.fromString('')).toThrow(InvalidBookingIdError)
    expect(() => BookingId.fromString('12345')).toThrow(InvalidBookingIdError)
  })

  it('compares by value', () => {
    const a = BookingId.fromString(validUuid)
    const b = BookingId.fromString(validUuid)
    const c = BookingId.fromString('11111111-1111-1111-1111-111111111111')
    expect(a.equals(b)).toBe(true)
    expect(a.equals(c)).toBe(false)
  })

  it('serializes to its string value', () => {
    expect(BookingId.fromString(validUuid).toString()).toBe(validUuid)
  })
})
