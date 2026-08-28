// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { clientIpFrom } from '@/lib/rate-limit'

describe('clientIpFrom', () => {
  it('takes the first IP from x-forwarded-for', () => {
    const headers = new Headers({ 'x-forwarded-for': '203.0.113.7, 10.0.0.1' })

    expect(clientIpFrom(headers)).toBe('203.0.113.7')
  })

  it('falls back to x-real-ip', () => {
    const headers = new Headers({ 'x-real-ip': '203.0.113.9' })

    expect(clientIpFrom(headers)).toBe('203.0.113.9')
  })

  it('returns "unknown" when no header is present', () => {
    expect(clientIpFrom(new Headers())).toBe('unknown')
  })

  it('trims whitespace around the forwarded IP', () => {
    const headers = new Headers({ 'x-forwarded-for': '  203.0.113.7 , 10.0.0.1' })

    expect(clientIpFrom(headers)).toBe('203.0.113.7')
  })
})
