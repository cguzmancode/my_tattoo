import { describe, it, expect } from 'vitest'
import { validatePayment } from '@/lib/schemas/payment'

describe('Payment Schema', () => {
  it('should validate valid payment data', () => {
    const validPayment = {
      amount: 2000,
      currency: 'eur',
    }

    const result = validatePayment(validPayment)

    expect(result.success).toBe(true)
  })

  it('should reject amount less than or equal to zero', () => {
    const invalidPayment = {
      amount: 0,
      currency: 'eur',
    }

    const result = validatePayment(invalidPayment)

    expect(result.success).toBe(false)
  })

  it('should reject negative amount', () => {
    const invalidPayment = {
      amount: -100,
      currency: 'eur',
    }

    const result = validatePayment(invalidPayment)

    expect(result.success).toBe(false)
  })

  it('should validate currency is EUR', () => {
    const validPayment = {
      amount: 2000,
      currency: 'eur',
    }

    const result = validatePayment(validPayment)

    expect(result.success).toBe(true)
  })
})
