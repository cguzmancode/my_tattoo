import { describe, it, expect, beforeEach, vi } from 'vitest'
import { prisma } from '@/lib/prisma'
import { currentUser, auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { POST as onboardingPOST } from '@/app/api/onboarding/route'

// Mock Clerk
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
}))

// Mock rate limit middleware
vi.mock('@/lib/rate-limit', () => ({
  rateLimitMiddleware: vi.fn().mockReturnValue({ success: true }),
}))

describe('POST /api/onboarding', () => {
  beforeEach(async () => {
    // Clean up test data
    await prisma.booking.deleteMany({})
    await prisma.artist.deleteMany({})
    
    // Reset mocks
    vi.clearAllMocks()
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

    // Create a mock request
    const request = new NextRequest('http://localhost:3000/api/onboarding', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' },
    })

    // Act: Call onboarding API
    const response = await onboardingPOST(request)
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
  }, 10000)

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

    // Create a mock request
    const request = new NextRequest('http://localhost:3000/api/onboarding', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' },
    })

    // Act
    const response = await onboardingPOST(request)
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
  }, 10000)

  it('should return 401 if user is not authenticated', async () => {
    // Arrange: No auth
    vi.mocked(auth).mockResolvedValue({ userId: null } as any)
    vi.mocked(currentUser).mockResolvedValue(null as any)

    // Create a mock request
    const request = new NextRequest('http://localhost:3000/api/onboarding', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    })

    // Act
    const response = await onboardingPOST(request)

    // Assert
    expect(response.status).toBe(401)
  }, 10000)
})
