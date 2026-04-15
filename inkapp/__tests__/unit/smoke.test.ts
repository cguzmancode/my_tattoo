import { describe, it, expect } from 'vitest'

describe('Smoke Tests - Environment Setup', () => {
  it('should pass a basic assertion', () => {
    expect(true).toBe(true)
  })

  it('should handle basic math', () => {
    expect(2 + 2).toBe(4)
  })

  it('should work with async', async () => {
    const result = await Promise.resolve('hello')
    expect(result).toBe('hello')
  })

  it('should have access to testing-library matchers', () => {
    const obj = { name: 'test' }
    expect(obj).toEqual({ name: 'test' })
  })
})

describe('Environment Variables', () => {
  it('should have NODE_ENV defined', () => {
    expect(process.env.NODE_ENV).toBeDefined()
  })
})
