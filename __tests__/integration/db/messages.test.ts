import { describe, it, expect, beforeAll } from 'vitest'
import { prisma } from '@/lib/prisma'

describe('Messages Integration Tests', () => {
  let testArtist: any
  let testBooking: any

  beforeAll(async () => {
    // Create test artist
    testArtist = await prisma.artist.create({
      data: {
        clerkId: `test_clerk_${Date.now()}`,
        name: 'Test Artist',
        email: `test${Date.now()}@example.com`,
        slug: `test-artist-${Date.now()}`,
      },
    })

    // Create test booking
    testBooking = await prisma.booking.create({
      data: {
        artistId: testArtist.id,
        clientName: 'Test Client',
        clientEmail: `client${Date.now()}@example.com`,
        clientPhone: '+34 123 456 789',
        bodyZone: 'Forearm',
        size: 'Medium',
        description: 'Test description',
        preferredDates: ['2024-06-01'],
        status: 'PENDING',
        depositPaid: false,
      },
    })
  })

  it('should create and retrieve messages for a booking', async () => {
    // Create a client message
    const clientMessage = await prisma.bookingMessage.create({
      data: {
        bookingId: testBooking.id,
        sender: 'client',
        message: 'Hello, I want to book a tattoo',
        read: false,
      },
    })

    expect(clientMessage.id).toBeDefined()
    expect(clientMessage.sender).toBe('client')
    expect(clientMessage.message).toBe('Hello, I want to book a tattoo')

    // Create an artist message
    const artistMessage = await prisma.bookingMessage.create({
      data: {
        bookingId: testBooking.id,
        sender: 'artist',
        message: 'Sure, when would you like to come?',
        read: false,
      },
    })

    expect(artistMessage.sender).toBe('artist')

    // Retrieve all messages for the booking
    const messages = await prisma.bookingMessage.findMany({
      where: { bookingId: testBooking.id },
      orderBy: { createdAt: 'asc' },
    })

    expect(messages).toHaveLength(2)
    expect(messages[0].sender).toBe('client')
    expect(messages[1].sender).toBe('artist')
  })

  it('should include messages when fetching booking with relations', async () => {
    // Create a new booking with messages
    const booking = await prisma.booking.create({
      data: {
        artistId: testArtist.id,
        clientName: 'Another Client',
        clientEmail: `another${Date.now()}@example.com`,
        clientPhone: '+34 987 654 321',
        bodyZone: 'Back',
        size: 'Large',
        description: 'Another test',
        preferredDates: ['2024-07-01'],
        status: 'PENDING',
        depositPaid: false,
        messages: {
          create: [
            { sender: 'client', message: 'First message', read: false },
            { sender: 'artist', message: 'Second message', read: false },
            { sender: 'client', message: 'Third message', read: false },
          ],
        },
      },
      include: {
        messages: true,
      },
    })

    expect(booking.messages).toHaveLength(3)
    expect(booking.messages[0].sender).toBe('client')
    expect(booking.messages[1].sender).toBe('artist')
    expect(booking.messages[2].sender).toBe('client')
  })

})
