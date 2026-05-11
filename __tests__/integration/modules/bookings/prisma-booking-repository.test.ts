import 'dotenv/config'
import { describe, it, expect, afterAll } from 'vitest'
import { randomUUID } from 'node:crypto'
import { prisma } from '@/lib/prisma'
import { PrismaBookingRepository } from '@/modules/bookings/infrastructure/prisma-booking-repository'
import { Booking } from '@/modules/bookings/domain/booking'
import { BookingId } from '@/modules/bookings/domain/booking-id'
import { BookingStatus } from '@/modules/bookings/domain/booking-status'
import { ProposedDate } from '@/modules/bookings/domain/proposed-date'

function uniqueSuffix() {
  return `test_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

async function seedArtist() {
  const id = uniqueSuffix()
  return prisma.artist.create({
    data: {
      clerkId: `artist_${id}`,
      email: `artist_${id}@test.com`,
      name: 'Test Artist',
      slug: `artist-slug-${id}`,
    },
  })
}

describe('PrismaBookingRepository', () => {
  const repo = new PrismaBookingRepository(prisma)

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('saves a new booking and reads it back via findById', async () => {
    const artist = await seedArtist()
    const bookingId = BookingId.fromString(randomUUID())
    const now = new Date()

    const booking = Booking.create({
      id: bookingId,
      artistId: artist.id,
      clientName: 'Repo Test',
      clientEmail: 'repo@example.com',
      clientPhone: null,
      bodyZone: 'arm',
      size: 'small',
      description: 'integration test booking',
      referenceImages: [],
      preferredDates: ['2026-12-01'],
      createdAt: now,
    })

    await repo.save(booking)

    const found = await repo.findById(bookingId)
    expect(found).not.toBeNull()
    expect(found!.status).toBe(BookingStatus.PENDING)
    expect(found!.clientName).toBe('Repo Test')
    expect(found!.proposedDate).toBeNull()
  })

  it('updates booking fields on save() upsert', async () => {
    const artist = await seedArtist()
    const bookingId = BookingId.fromString(randomUUID())
    const now = new Date()
    const future = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    const initial = Booking.create({
      id: bookingId,
      artistId: artist.id,
      clientName: 'Upsert Test',
      clientEmail: 'upsert@example.com',
      clientPhone: null,
      bodyZone: 'leg',
      size: 'medium',
      description: 'will be accepted',
      referenceImages: [],
      preferredDates: [future.toISOString()],
      createdAt: now,
    })
    await repo.save(initial)

    const accepted = initial.accept(new Date(), ProposedDate.fromDate(future, now))
    await repo.save(accepted)

    const reloaded = await repo.findById(bookingId)
    expect(reloaded!.status).toBe(BookingStatus.ACCEPTED)
    expect(reloaded!.proposedDate?.value.toISOString()).toBe(future.toISOString())
  })

  it('findByArtistId returns only the given artist bookings, newest first', async () => {
    const artistA = await seedArtist()
    const artistB = await seedArtist()
    const now = new Date()
    const olderId = BookingId.fromString(randomUUID())
    const newerId = BookingId.fromString(randomUUID())

    const older = Booking.create({
      id: olderId,
      artistId: artistA.id,
      clientName: 'A1',
      clientEmail: 'a1@example.com',
      clientPhone: null,
      bodyZone: 'arm',
      size: 'small',
      description: 'older',
      referenceImages: [],
      preferredDates: [],
      createdAt: new Date(now.getTime() - 10_000),
    })
    const newer = Booking.create({
      id: newerId,
      artistId: artistA.id,
      clientName: 'A2',
      clientEmail: 'a2@example.com',
      clientPhone: null,
      bodyZone: 'arm',
      size: 'small',
      description: 'newer',
      referenceImages: [],
      preferredDates: [],
      createdAt: now,
    })
    const otherArtists = Booking.create({
      id: BookingId.fromString(randomUUID()),
      artistId: artistB.id,
      clientName: 'B1',
      clientEmail: 'b1@example.com',
      clientPhone: null,
      bodyZone: 'arm',
      size: 'small',
      description: 'belongs to B',
      referenceImages: [],
      preferredDates: [],
      createdAt: now,
    })

    await Promise.all([repo.save(older), repo.save(newer), repo.save(otherArtists)])

    const result = await repo.findByArtistId(artistA.id)
    const ids = result.map((b) => b.id.value)
    expect(ids).toContain(olderId.value)
    expect(ids).toContain(newerId.value)
    expect(ids).not.toContain(otherArtists.id.value)
    expect(ids.indexOf(newerId.value)).toBeLessThan(ids.indexOf(olderId.value))
  })

  it('findById returns null for unknown ids', async () => {
    const unknown = BookingId.fromString(randomUUID())
    expect(await repo.findById(unknown)).toBeNull()
  })
})
