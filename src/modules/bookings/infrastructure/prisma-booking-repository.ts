import type { PrismaClient, Booking as PrismaBooking } from '@prisma/client'
import { Booking } from '../domain/booking'
import { BookingId } from '../domain/booking-id'
import { BookingStatus } from '../domain/booking-status'
import { ProposedDate } from '../domain/proposed-date'
import type { BookingRepository } from '../application/ports/booking-repository'

export class PrismaBookingRepository implements BookingRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: BookingId): Promise<Booking | null> {
    const row = await this.prisma.booking.findUnique({ where: { id: id.value } })
    return row ? this.toDomain(row) : null
  }

  async findByArtistId(artistId: string): Promise<Booking[]> {
    const rows = await this.prisma.booking.findMany({
      where: { artistId },
      orderBy: { createdAt: 'desc' },
    })
    return rows.map((r) => this.toDomain(r))
  }

  async save(booking: Booking): Promise<void> {
    await this.prisma.booking.upsert({
      where: { id: booking.id.value },
      create: {
        id: booking.id.value,
        artistId: booking.artistId,
        clientName: booking.clientName,
        clientEmail: booking.clientEmail,
        clientPhone: booking.clientPhone,
        bodyZone: booking.bodyZone,
        size: booking.size,
        description: booking.description,
        referenceImages: [...booking.referenceImages],
        preferredDates: [...booking.preferredDates],
        status: booking.status,
        proposedDate: booking.proposedDate?.value ?? null,
        depositPaid: booking.depositPaid,
        priceEstimate: booking.priceEstimate,
        durationEstimate: booking.durationEstimate,
        artistNotes: booking.artistNotes,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      },
      update: {
        status: booking.status,
        proposedDate: booking.proposedDate?.value ?? null,
        depositPaid: booking.depositPaid,
        priceEstimate: booking.priceEstimate,
        durationEstimate: booking.durationEstimate,
        artistNotes: booking.artistNotes,
        updatedAt: booking.updatedAt,
      },
    })
  }

  private toDomain(row: PrismaBooking): Booking {
    return Booking.fromPersistence({
      id: BookingId.fromString(row.id),
      artistId: row.artistId,
      clientName: row.clientName,
      clientEmail: row.clientEmail,
      clientPhone: row.clientPhone,
      bodyZone: row.bodyZone,
      size: row.size,
      description: row.description,
      referenceImages: row.referenceImages,
      preferredDates: row.preferredDates,
      status: row.status as BookingStatus,
      proposedDate: row.proposedDate ? ProposedDate.fromPersistence(row.proposedDate) : null,
      depositPaid: row.depositPaid,
      priceEstimate: row.priceEstimate,
      durationEstimate: row.durationEstimate,
      artistNotes: row.artistNotes,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    })
  }
}
