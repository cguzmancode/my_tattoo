import { InvalidProposedDateError } from './errors'

export class ProposedDate {
  private constructor(public readonly value: Date) {}

  static fromDate(value: Date, now: Date): ProposedDate {
    if (Number.isNaN(value.getTime())) {
      throw new InvalidProposedDateError('Date is invalid')
    }
    if (value.getTime() <= now.getTime()) {
      throw new InvalidProposedDateError('Proposed date must be in the future')
    }
    return new ProposedDate(new Date(value.getTime()))
  }

  static fromISOString(value: string, now: Date): ProposedDate {
    return ProposedDate.fromDate(new Date(value), now)
  }

  toISOString(): string {
    return this.value.toISOString()
  }

  equals(other: ProposedDate): boolean {
    return this.value.getTime() === other.value.getTime()
  }
}
