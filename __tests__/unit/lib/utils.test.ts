import { describe, it, expect } from 'vitest'
import { generateSlug, formatCurrency, isFutureDate } from '@/lib/utils'

describe('generateSlug', () => {
  it('should convert "Ink Studio" to "ink-studio"', () => {
    expect(generateSlug('Ink Studio')).toBe('ink-studio')
  })

  it('should handle multiple spaces', () => {
    expect(generateSlug('Ink   Studio')).toBe('ink-studio')
  })

  it('should handle special characters', () => {
    expect(generateSlug('Ink Studio!')).toBe('ink-studio')
  })

  it('should handle uppercase', () => {
    expect(generateSlug('INK STUDIO')).toBe('ink-studio')
  })
})

describe('formatCurrency', () => {
  it('should format cents to EUR', () => {
    expect(formatCurrency(2000)).toBe('€20.00')
  })

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('€0.00')
  })
})

describe('isFutureDate', () => {
  it('should return true for future date', () => {
    const future = new Date(Date.now() + 86400000)
    expect(isFutureDate(future)).toBe(true)
  })

  it('should return false for past date', () => {
    const past = new Date(Date.now() - 86400000)
    expect(isFutureDate(past)).toBe(false)
  })
})
