import { BookingId } from './booking-id'
import { BookingStatus, canTransitionTo } from './booking-status'
import { ProposedDate } from './proposed-date'
import {
  InvalidStatusTransitionError,
  MissingProposedDateError,
} from './errors'

export interface BookingProps {
  id: BookingId
  artistId: string
  clientName: string
  clientEmail: string
  clientPhone: string | null
  bodyZone: string
  size: string
  description: string
  referenceImages: readonly string[]
  preferredDates: readonly string[]
  status: BookingStatus
  proposedDate: ProposedDate | null
  depositPaid: boolean
  priceEstimate: number | null
  durationEstimate: string | null
  artistNotes: string | null
  createdAt: Date
  updatedAt: Date
}

export type NewBookingProps = Omit<
  BookingProps,
  'id' | 'status' | 'proposedDate' | 'depositPaid' | 'priceEstimate'
    | 'durationEstimate' | 'artistNotes' | 'createdAt' | 'updatedAt'
> & {
  id: BookingId
  createdAt: Date
}

export class Booking {
  private constructor(private readonly props: BookingProps) {}

  static create(input: NewBookingProps): Booking {
    return new Booking({
      ...input,
      status: BookingStatus.PENDING,
      proposedDate: null,
      depositPaid: false,
      priceEstimate: null,
      durationEstimate: null,
      artistNotes: null,
      updatedAt: input.createdAt,
    })
  }

  static fromPersistence(props: BookingProps): Booking {
    return new Booking(props)
  }

  get id(): BookingId { return this.props.id }
  get artistId(): string { return this.props.artistId }
  get clientName(): string { return this.props.clientName }
  get clientEmail(): string { return this.props.clientEmail }
  get clientPhone(): string | null { return this.props.clientPhone }
  get bodyZone(): string { return this.props.bodyZone }
  get size(): string { return this.props.size }
  get description(): string { return this.props.description }
  get referenceImages(): readonly string[] { return this.props.referenceImages }
  get preferredDates(): readonly string[] { return this.props.preferredDates }
  get status(): BookingStatus { return this.props.status }
  get proposedDate(): ProposedDate | null { return this.props.proposedDate }
  get depositPaid(): boolean { return this.props.depositPaid }
  get priceEstimate(): number | null { return this.props.priceEstimate }
  get durationEstimate(): string | null { return this.props.durationEstimate }
  get artistNotes(): string | null { return this.props.artistNotes }
  get createdAt(): Date { return this.props.createdAt }
  get updatedAt(): Date { return this.props.updatedAt }

  isOwnedBy(artistId: string): boolean {
    return this.props.artistId === artistId
  }

  accept(now: Date, proposedDate: ProposedDate): Booking {
    this.assertCanTransitionTo(BookingStatus.ACCEPTED)
    if (!proposedDate) throw new MissingProposedDateError()
    return this.with({
      status: BookingStatus.ACCEPTED,
      proposedDate,
      updatedAt: now,
    })
  }

  reject(now: Date): Booking {
    this.assertCanTransitionTo(BookingStatus.REJECTED)
    return this.with({ status: BookingStatus.REJECTED, updatedAt: now })
  }

  confirm(now: Date): Booking {
    this.assertCanTransitionTo(BookingStatus.CONFIRMED)
    return this.with({
      status: BookingStatus.CONFIRMED,
      depositPaid: true,
      updatedAt: now,
    })
  }

  complete(now: Date): Booking {
    this.assertCanTransitionTo(BookingStatus.COMPLETED)
    return this.with({ status: BookingStatus.COMPLETED, updatedAt: now })
  }

  cancel(now: Date): Booking {
    this.assertCanTransitionTo(BookingStatus.CANCELLED)
    return this.with({ status: BookingStatus.CANCELLED, updatedAt: now })
  }

  private assertCanTransitionTo(target: BookingStatus): void {
    if (!canTransitionTo(this.props.status, target)) {
      throw new InvalidStatusTransitionError(this.props.status, target)
    }
  }

  private with(patch: Partial<BookingProps>): Booking {
    return new Booking({ ...this.props, ...patch })
  }
}
