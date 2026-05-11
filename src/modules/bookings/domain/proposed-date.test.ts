import { describe, it, expect } from 'vitest'
import { ProposedDate } from './proposed-date'
import { InvalidProposedDateError } from './errors'

describe('ProposedDate', () => {
  const now = new Date('2026-05-11T12:00:00Z')

  it('accepts a future date', () => {
    const future = new Date('2026-06-01T10:00:00Z')
    const proposed = ProposedDate.fromDate(future, now)
    expect(proposed.toISOString()).toBe('2026-06-01T10:00:00.000Z')
  })

  it('rejects a past date', () => {
    const past = new Date('2026-04-01T10:00:00Z')
    expect(() => ProposedDate.fromDate(past, now)).toThrow(InvalidProposedDateError)
  })

  it('rejects the exact current instant', () => {
    expect(() => ProposedDate.fromDate(now, now)).toThrow(InvalidProposedDateError)
  })

  it('rejects an invalid date', () => {
    expect(() => ProposedDate.fromDate(new Date('not-a-date'), now)).toThrow(InvalidProposedDateError)
  })

  it('parses ISO strings', () => {
    const proposed = ProposedDate.fromISOString('2026-06-01T10:00:00Z', now)
    expect(proposed.toISOString()).toBe('2026-06-01T10:00:00.000Z')
  })

  it('is immutable: mutating the source Date does not affect the value object', () => {
    const future = new Date('2026-06-01T10:00:00Z')
    const proposed = ProposedDate.fromDate(future, now)
    future.setFullYear(2099)
    expect(proposed.toISOString()).toBe('2026-06-01T10:00:00.000Z')
  })

  it('compares by timestamp', () => {
    const a = ProposedDate.fromISOString('2026-06-01T10:00:00Z', now)
    const b = ProposedDate.fromISOString('2026-06-01T10:00:00Z', now)
    const c = ProposedDate.fromISOString('2026-07-01T10:00:00Z', now)
    expect(a.equals(b)).toBe(true)
    expect(a.equals(c)).toBe(false)
  })
})
