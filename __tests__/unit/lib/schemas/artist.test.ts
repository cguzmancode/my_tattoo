import { describe, it, expect } from 'vitest'
import { validateArtist } from '@/lib/schemas/artist'

describe('Artist Schema', () => {
  it('should validate valid artist data', () => {
    const validArtist = {
      clerkId: 'user_123',
      email: 'artist@test.com',
      name: 'Ink Studio',
      slug: 'ink-studio',
      depositAmount: 2000,
    }

    const result = validateArtist(validArtist)

    expect(result.success).toBe(true)
  })

  it('should reject invalid email', () => {
    const invalidArtist = {
      clerkId: 'user_123',
      email: 'not-an-email',
      name: 'Ink Studio',
      slug: 'ink-studio',
      depositAmount: 2000,
    }

    const result = validateArtist(invalidArtist)

    expect(result.success).toBe(false)
  })

  it('should reject slug with special characters', () => {
    const invalidArtist = {
      clerkId: 'user_123',
      email: 'artist@test.com',
      name: 'Ink Studio',
      slug: 'ink@studio!',
      depositAmount: 2000,
    }

    const result = validateArtist(invalidArtist)

    expect(result.success).toBe(false)
  })

  it('should reject negative deposit amount', () => {
    const invalidArtist = {
      clerkId: 'user_123',
      email: 'artist@test.com',
      name: 'Ink Studio',
      slug: 'ink-studio',
      depositAmount: -100,
    }

    const result = validateArtist(invalidArtist)

    expect(result.success).toBe(false)
  })

  it('should accept missing optional fields', () => {
    const artistWithOnlyRequiredFields = {
      clerkId: 'user_123',
      email: 'artist@test.com',
      name: 'Ink Studio',
      slug: 'ink-studio',
      depositAmount: 2000,
    }

    const result = validateArtist(artistWithOnlyRequiredFields)

    expect(result.success).toBe(true)
  })
})
