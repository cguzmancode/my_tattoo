import type { Clock } from '../application/ports/clock'

export class FixedClock implements Clock {
  constructor(private value: Date) {}

  now(): Date {
    return new Date(this.value.getTime())
  }

  advanceTo(value: Date): void {
    this.value = new Date(value.getTime())
  }
}
