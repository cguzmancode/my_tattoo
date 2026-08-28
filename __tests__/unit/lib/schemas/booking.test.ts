import { describe, it, expect } from 'vitest'
import { validateBooking } from '@/lib/schemas/booking'

describe('Booking Schema', () => {
  it('should validate valid booking request', () => {
    const validBooking = {
      artistSlug: 'alex-rivera-tattoo',
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
      artistSlug: 'alex-rivera-tattoo',
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
      artistSlug: 'alex-rivera-tattoo',
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
      artistSlug: 'alex-rivera-tattoo',
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
      artistSlug: 'alex-rivera-tattoo',
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
      artistSlug: 'alex-rivera-tattoo',
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

describe('Booking Schema — artistSlug', () => {
  const base = {
    clientName: 'María García',
    clientEmail: 'maria@example.com',
    bodyZone: 'brazo',
    size: 'mediano',
    description: 'Minimalist rose',
    preferredDates: ['2026-05-15'],
  }

  it('accepts a valid kebab-case slug', () => {
    const result = validateBooking({ ...base, artistSlug: 'alex-rivera-tattoo' })

    expect(result.success).toBe(true)
  })

  it('accepts a single-word slug with digits', () => {
    const result = validateBooking({ ...base, artistSlug: 'ink42' })

    expect(result.success).toBe(true)
  })

  it('rejects a missing artistSlug', () => {
    const result = validateBooking(base)

    expect(result.success).toBe(false)
  })

  it('rejects path traversal attempts', () => {
    const result = validateBooking({ ...base, artistSlug: '../other-bucket' })

    expect(result.success).toBe(false)
  })

  it('rejects slashes and uppercase', () => {
    expect(validateBooking({ ...base, artistSlug: 'a/b' }).success).toBe(false)
    expect(validateBooking({ ...base, artistSlug: 'Alex-Rivera' }).success).toBe(false)
  })

  it('rejects an empty slug', () => {
    const result = validateBooking({ ...base, artistSlug: '' })

    expect(result.success).toBe(false)
  })
})
