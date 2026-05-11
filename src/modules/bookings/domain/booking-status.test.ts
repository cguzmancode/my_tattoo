import { describe, it, expect } from 'vitest'
import { BookingStatus, canTransitionTo, isTerminal } from './booking-status'

describe('BookingStatus transitions', () => {
  describe('PENDING', () => {
    it('can transition to ACCEPTED, REJECTED and CANCELLED', () => {
      expect(canTransitionTo(BookingStatus.PENDING, BookingStatus.ACCEPTED)).toBe(true)
      expect(canTransitionTo(BookingStatus.PENDING, BookingStatus.REJECTED)).toBe(true)
      expect(canTransitionTo(BookingStatus.PENDING, BookingStatus.CANCELLED)).toBe(true)
    })

    it('cannot transition directly to CONFIRMED or COMPLETED', () => {
      expect(canTransitionTo(BookingStatus.PENDING, BookingStatus.CONFIRMED)).toBe(false)
      expect(canTransitionTo(BookingStatus.PENDING, BookingStatus.COMPLETED)).toBe(false)
    })
  })

  describe('ACCEPTED', () => {
    it('can transition to CONFIRMED and CANCELLED', () => {
      expect(canTransitionTo(BookingStatus.ACCEPTED, BookingStatus.CONFIRMED)).toBe(true)
      expect(canTransitionTo(BookingStatus.ACCEPTED, BookingStatus.CANCELLED)).toBe(true)
    })

    it('cannot transition back to PENDING or to REJECTED', () => {
      expect(canTransitionTo(BookingStatus.ACCEPTED, BookingStatus.PENDING)).toBe(false)
      expect(canTransitionTo(BookingStatus.ACCEPTED, BookingStatus.REJECTED)).toBe(false)
    })
  })

  describe('CONFIRMED', () => {
    it('can transition to COMPLETED and CANCELLED', () => {
      expect(canTransitionTo(BookingStatus.CONFIRMED, BookingStatus.COMPLETED)).toBe(true)
      expect(canTransitionTo(BookingStatus.CONFIRMED, BookingStatus.CANCELLED)).toBe(true)
    })
  })

  describe('terminal states', () => {
    it.each([BookingStatus.REJECTED, BookingStatus.COMPLETED, BookingStatus.CANCELLED])(
      '%s is terminal and has no outgoing transitions',
      (status) => {
        expect(isTerminal(status)).toBe(true)
        for (const target of Object.values(BookingStatus)) {
          expect(canTransitionTo(status, target)).toBe(false)
        }
      },
    )

    it.each([BookingStatus.PENDING, BookingStatus.ACCEPTED, BookingStatus.CONFIRMED])(
      '%s is not terminal',
      (status) => {
        expect(isTerminal(status)).toBe(false)
      },
    )
  })
})
