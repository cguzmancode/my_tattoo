export class BookingNotFoundError extends Error {
  constructor(public readonly bookingId: string) {
    super(`Booking with id "${bookingId}" not found`)
    this.name = 'BookingNotFoundError'
  }
}

export class InvalidStatusTransitionError extends Error {
  constructor(
    public readonly from: string,
    public readonly to: string,
  ) {
    super(`Cannot transition booking from "${from}" to "${to}"`)
    this.name = 'InvalidStatusTransitionError'
  }
}

export class UnauthorizedBookingAccessError extends Error {
  constructor() {
    super('Artist is not authorized to access this booking')
    this.name = 'UnauthorizedBookingAccessError'
  }
}

export class InvalidBookingIdError extends Error {
  constructor(public readonly value: string) {
    super(`Invalid booking id: "${value}". Expected a UUID.`)
    this.name = 'InvalidBookingIdError'
  }
}

export class InvalidProposedDateError extends Error {
  constructor(public readonly reason: string) {
    super(`Invalid proposed date: ${reason}`)
    this.name = 'InvalidProposedDateError'
  }
}

export class MissingProposedDateError extends Error {
  constructor() {
    super('Cannot accept a booking without a proposed date')
    this.name = 'MissingProposedDateError'
  }
}

export class EmptyMessageError extends Error {
  constructor() {
    super('Message cannot be empty')
    this.name = 'EmptyMessageError'
  }
}
