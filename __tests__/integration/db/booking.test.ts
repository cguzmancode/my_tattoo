import 'dotenv/config'
import { describe, it, expect } from 'vitest'
import { PrismaClient, BookingStatus } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined')
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

function generateUniqueId() {
  return `test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

describe('Booking Model', () => {
  it('should create booking with PENDING status', async () => {
    const uniqueId = generateUniqueId()

    // Create artist first
    const artist = await prisma.artist.create({
      data: {
        clerkId: `artist_${uniqueId}`,
        email: `artist_${uniqueId}@test.com`,
        name: 'Test Artist',
        slug: `artist-slug-${uniqueId}`,
      },
    })

    const booking = await prisma.booking.create({
      data: {
        artistId: artist.id,
        clientName: 'María García',
        clientEmail: `client_${uniqueId}@example.com`,
        bodyZone: 'brazo',
        size: 'mediano',
        description: 'Minimalist rose',
        preferredDates: ['2026-05-15'],
      },
    })

    expect(booking).toBeDefined()
    expect(booking.clientName).toBe('María García')
    expect(booking.status).toBe(BookingStatus.PENDING)
    expect(booking.depositPaid).toBe(false)
  })

  it('should update status to ACCEPTED', async () => {
    const uniqueId = generateUniqueId()

    const artist = await prisma.artist.create({
      data: {
        clerkId: `artist_${uniqueId}`,
        email: `artist_${uniqueId}@test.com`,
        name: 'Test Artist',
        slug: `artist-slug-${uniqueId}`,
      },
    })

    const booking = await prisma.booking.create({
      data: {
        artistId: artist.id,
        clientName: 'María García',
        clientEmail: `client_${uniqueId}@example.com`,
        bodyZone: 'brazo',
        size: 'mediano',
        description: 'Minimalist rose',
        preferredDates: ['2026-05-15'],
      },
    })

    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: { status: BookingStatus.ACCEPTED, proposedDate: new Date('2026-05-15') },
    })

    expect(updated.status).toBe(BookingStatus.ACCEPTED)
    expect(updated.proposedDate).toBeDefined()
  })

  it('should relate to artist', async () => {
    const uniqueId = generateUniqueId()

    const artist = await prisma.artist.create({
      data: {
        clerkId: `artist_${uniqueId}`,
        email: `artist_${uniqueId}@test.com`,
        name: 'Test Artist',
        slug: `artist-slug-${uniqueId}`,
      },
    })

    const booking = await prisma.booking.create({
      data: {
        artistId: artist.id,
        clientName: 'María García',
        clientEmail: `client_${uniqueId}@example.com`,
        bodyZone: 'brazo',
        size: 'mediano',
        description: 'Minimalist rose',
        preferredDates: ['2026-05-15'],
      },
      include: { artist: true },
    })

    expect(booking.artist).toBeDefined()
    expect(booking.artist.id).toBe(artist.id)
  })

  it('should query bookings by artistId', async () => {
    const uniqueId = generateUniqueId()

    const artist = await prisma.artist.create({
      data: {
        clerkId: `artist_${uniqueId}`,
        email: `artist_${uniqueId}@test.com`,
        name: 'Test Artist',
        slug: `artist-slug-${uniqueId}`,
      },
    })

    await prisma.booking.create({
      data: {
        artistId: artist.id,
        clientName: 'María García',
        clientEmail: `client_${uniqueId}@example.com`,
        bodyZone: 'brazo',
        size: 'mediano',
        description: 'Minimalist rose',
        preferredDates: ['2026-05-15'],
      },
    })

    const bookings = await prisma.booking.findMany({
      where: { artistId: artist.id },
    })

    expect(bookings).toHaveLength(1)
    expect(bookings[0].clientName).toBe('María García')
  })

  it('should query bookings by status', async () => {
    const uniqueId = generateUniqueId()

    const artist = await prisma.artist.create({
      data: {
        clerkId: `artist_${uniqueId}`,
        email: `artist_${uniqueId}@test.com`,
        name: 'Test Artist',
        slug: `artist-slug-${uniqueId}`,
      },
    })

    await prisma.booking.create({
      data: {
        artistId: artist.id,
        clientName: 'Client 1',
        clientEmail: `client1_${uniqueId}@example.com`,
        bodyZone: 'brazo',
        size: 'mediano',
        description: 'Tattoo 1',
        preferredDates: ['2026-05-15'],
        status: BookingStatus.PENDING,
      },
    })

    await prisma.booking.create({
      data: {
        artistId: artist.id,
        clientName: 'Client 2',
        clientEmail: `client2_${uniqueId}@example.com`,
        bodyZone: 'pierna',
        size: 'grande',
        description: 'Tattoo 2',
        preferredDates: ['2026-05-16'],
        status: BookingStatus.CONFIRMED,
      },
    })

    const pending = await prisma.booking.findMany({
      where: { artistId: artist.id, status: BookingStatus.PENDING },
    })

    expect(pending).toHaveLength(1)
    expect(pending[0].clientName).toBe('Client 1')
  })
})
