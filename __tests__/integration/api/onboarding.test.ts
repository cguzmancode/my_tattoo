import { describe, it, expect, beforeEach, vi } from 'vitest'
import { prisma } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'

// Mock Clerk
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
}))

describe('POST /api/onboarding', () => {
  beforeEach(async () => {
    // Clean up test data
    await prisma.booking.deleteMany({})
    await prisma.artist.deleteMany({})
  })

  it('should create artist automatically if not exists when completing onboarding', async () => {
    // Arrange: Mock authenticated user
    const mockUser = {
      id: 'test_clerk_id_123',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
      firstName: 'Test',
      lastName: 'Artist',
    }
    
    vi.mocked(currentUser).mockResolvedValue(mockUser as any)
    vi.mocked(auth).mockResolvedValue({ userId: 'test_clerk_id_123' } as any)

    const formData = {
      name: 'Test Tattoo Artist',
      bio: 'Especialista en tradicional',
      styles: ['Traditional', 'Blackwork'],
      depositAmount: '50',
      instagramUrl: '@testartist',
    }

    // Act: Call onboarding API
    const response = await fetch('http://localhost:3000/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    const result = await response.json()

    // Assert: Should succeed
    expect(response.status).toBe(200)
    expect(result.success).toBe(true)
    expect(result.artist).toBeDefined()
    expect(result.artist.name).toBe('Test Tattoo Artist')
    expect(result.artist.slug).toBeDefined()

    // Assert: Artist should exist in database
    const artist = await prisma.artist.findUnique({
      where: { clerkId: 'test_clerk_id_123' },
    })
    expect(artist).not.toBeNull()
    expect(artist?.name).toBe('Test Tattoo Artist')
    expect(artist?.email).toBe('test@example.com')
  })

  it('should update existing artist if already created by webhook', async () => {
    // Arrange: Create artist first (simulating webhook)
    await prisma.artist.create({
      data: {
        clerkId: 'existing_clerk_id',
        email: 'existing@example.com',
        name: 'Temp Name',
        slug: 'temp-slug-123',
      },
    })

    const mockUser = {
      id: 'existing_clerk_id',
      emailAddresses: [{ emailAddress: 'existing@example.com' }],
      firstName: 'Existing',
      lastName: 'Artist',
    }
    
    vi.mocked(currentUser).mockResolvedValue(mockUser as any)
    vi.mocked(auth).mockResolvedValue({ userId: 'existing_clerk_id' } as any)

    const formData = {
      name: 'Updated Artist Name',
      bio: 'Updated bio',
      styles: ['Realism'],
      depositAmount: '100',
    }

    // Act
    const response = await fetch('http://localhost:3000/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    const result = await response.json()

    // Assert
    expect(response.status).toBe(200)
    expect(result.artist.name).toBe('Updated Artist Name')

    // Verify in database
    const artist = await prisma.artist.findUnique({
      where: { clerkId: 'existing_clerk_id' },
    })
    expect(artist?.name).toBe('Updated Artist Name')
    expect(artist?.bio).toBe('Updated bio')
  })

  it('should return 401 if user is not authenticated', async () => {
    // Arrange: No auth
    vi.mocked(auth).mockResolvedValue({ userId: null } as any)
    vi.mocked(currentUser).mockResolvedValue(null as any)

    // Act
    const response = await fetch('http://localhost:3000/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })

    // Assert
    expect(response.status).toBe(401)
  })
})
