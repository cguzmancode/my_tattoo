export const BookingStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const

export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus]

const TRANSITIONS: Record<BookingStatus, readonly BookingStatus[]> = {
  PENDING: [BookingStatus.ACCEPTED, BookingStatus.REJECTED, BookingStatus.CANCELLED],
  ACCEPTED: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
  CONFIRMED: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
  REJECTED: [],
  COMPLETED: [],
  CANCELLED: [],
}

export function canTransitionTo(from: BookingStatus, to: BookingStatus): boolean {
  return TRANSITIONS[from].includes(to)
}

export function isTerminal(status: BookingStatus): boolean {
  return TRANSITIONS[status].length === 0
}
