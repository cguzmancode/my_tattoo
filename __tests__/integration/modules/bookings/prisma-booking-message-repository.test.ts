import 'dotenv/config'
import { describe, it, expect, afterAll } from 'vitest'
import { randomUUID } from 'node:crypto'
import { prisma } from '@/lib/prisma'
import { PrismaBookingRepository } from '@/modules/bookings/infrastructure/prisma-booking-repository'
import { PrismaBookingMessageRepository } from '@/modules/bookings/infrastructure/prisma-booking-message-repository'
import { Booking } from '@/modules/bookings/domain/booking'
import { BookingId } from '@/modules/bookings/domain/booking-id'
import { BookingMessage, MessageSender } from '@/modules/bookings/domain/booking-message'

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

async function seedBooking(bookingRepo: PrismaBookingRepository, artistId: string) {
  const id = BookingId.fromString(randomUUID())
  const now = new Date()
  await bookingRepo.save(
    Booking.create({
      id,
      artistId,
      clientName: 'Msg Test',
      clientEmail: 'msg@example.com',
      clientPhone: null,
      bodyZone: 'arm',
      size: 'small',
      description: 'for messages',
      referenceImages: [],
      preferredDates: [],
      createdAt: now,
    }),
  )
  return id
}

describe('PrismaBookingMessageRepository', () => {
  const bookingRepo = new PrismaBookingRepository(prisma)
  const messageRepo = new PrismaBookingMessageRepository(prisma)

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('adds a message and finds it by bookingId', async () => {
    const artist = await seedArtist()
    const bookingId = await seedBooking(bookingRepo, artist.id)
    const now = new Date()

    const msg = BookingMessage.create({
      id: randomUUID(),
      bookingId,
      sender: MessageSender.CLIENT,
      message: 'Hello from the client',
      createdAt: now,
    })
    await messageRepo.add(msg)

    const found = await messageRepo.findByBookingId(bookingId)
    expect(found).toHaveLength(1)
    expect(found[0].message).toBe('Hello from the client')
    expect(found[0].sender).toBe(MessageSender.CLIENT)
  })

  it('maps sender between domain casing (ARTIST/CLIENT) and DB casing (artist/client)', async () => {
    const artist = await seedArtist()
    const bookingId = await seedBooking(bookingRepo, artist.id)
    const now = new Date()

    await messageRepo.add(
      BookingMessage.create({
        id: randomUUID(),
        bookingId,
        sender: MessageSender.ARTIST,
        message: 'Reply from artist',
        createdAt: now,
      }),
    )

    const found = await messageRepo.findByBookingId(bookingId)
    expect(found[0].sender).toBe(MessageSender.ARTIST)

    const raw = await prisma.bookingMessage.findFirst({
      where: { bookingId: bookingId.value },
    })
    expect(raw?.sender).toBe('artist')
  })

  it('returns messages ordered by createdAt ascending', async () => {
    const artist = await seedArtist()
    const bookingId = await seedBooking(bookingRepo, artist.id)
    const t0 = new Date(Date.now() - 60_000)
    const t1 = new Date(Date.now() - 30_000)
    const t2 = new Date()

    await messageRepo.add(
      BookingMessage.create({
        id: randomUUID(), bookingId, sender: MessageSender.CLIENT, message: 'first', createdAt: t0,
      }),
    )
    await messageRepo.add(
      BookingMessage.create({
        id: randomUUID(), bookingId, sender: MessageSender.ARTIST, message: 'second', createdAt: t1,
      }),
    )
    await messageRepo.add(
      BookingMessage.create({
        id: randomUUID(), bookingId, sender: MessageSender.CLIENT, message: 'third', createdAt: t2,
      }),
    )

    const found = await messageRepo.findByBookingId(bookingId)
    expect(found.map((m) => m.message)).toEqual(['first', 'second', 'third'])
  })
})
