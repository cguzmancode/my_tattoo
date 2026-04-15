import { describe, it, expect } from 'vitest'
import { validateBooking } from '@/lib/schemas/booking'

describe('Booking Schema', () => {
  it('should validate valid booking request', () => {
    const validBooking = {
      clientName: 'María García',
      clientEmail: 'maria@example.com',
      bodyZone: 'brazo',
      size: 'mediano',
      description: 'Minimalist rose',
      preferredDates: ['2026-05-15'],
    }

    const result = validateBooking(validBooking)

    expect(result.success).toBe(true)
  })

  it('should require clientName', () => {
    const invalidBooking = {
      clientName: '',
      clientEmail: 'maria@example.com',
      bodyZone: 'brazo',
      size: 'mediano',
      description: 'Minimalist rose',
      preferredDates: ['2026-05-15'],
    }

    const result = validateBooking(invalidBooking)

    expect(result.success).toBe(false)
  })

  it('should validate clientEmail format', () => {
    const invalidBooking = {
      clientName: 'María García',
      clientEmail: 'invalid-email',
      bodyZone: 'brazo',
      size: 'mediano',
      description: 'Minimalist rose',
      preferredDates: ['2026-05-15'],
    }

    const result = validateBooking(invalidBooking)

    expect(result.success).toBe(false)
  })

  it('should require bodyZone', () => {
    const invalidBooking = {
      clientName: 'María García',
      clientEmail: 'maria@example.com',
      bodyZone: '',
      size: 'mediano',
      description: 'Minimalist rose',
      preferredDates: ['2026-05-15'],
    }

    const result = validateBooking(invalidBooking)

    expect(result.success).toBe(false)
  })

  it('should require size', () => {
    const invalidBooking = {
      clientName: 'María García',
      clientEmail: 'maria@example.com',
      bodyZone: 'brazo',
      size: '',
      description: 'Minimalist rose',
      preferredDates: ['2026-05-15'],
    }

    const result = validateBooking(invalidBooking)

    expect(result.success).toBe(false)
  })

  it('should accept multiple preferred dates', () => {
    const validBooking = {
      clientName: 'María García',
      clientEmail: 'maria@example.com',
      bodyZone: 'brazo',
      size: 'mediano',
      description: 'Minimalist rose',
      preferredDates: ['2026-05-15', '2026-05-16', '2026-05-17'],
    }

    const result = validateBooking(validBooking)

    expect(result.success).toBe(true)
  })
})
