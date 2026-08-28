// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock everything that touches the outside world. This test pins down the
// ORDER of operations: no byte reaches Storage before the artist slug is
// resolved and every file is validated.
const uploadMock = vi.fn()
const getPublicUrlMock = vi.fn()

vi.mock('@/lib/rate-limit', () => ({
  rateLimitMiddleware: vi.fn().mockReturnValue({ success: true }),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    artist: {
      findUnique: vi.fn(),
    },
  },
}))

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(() => ({
    storage: {
      from: vi.fn(() => ({
        upload: uploadMock,
        getPublicUrl: getPublicUrlMock,
      })),
    },
  })),
}))

vi.mock('@/lib/api/bookings', () => ({
  createBooking: vi.fn(),
}))

import { POST } from '@/app/api/bookings/route'
import { prisma } from '@/lib/prisma'
import { createBooking } from '@/lib/api/bookings'

function buildForm(overrides: Record<string, string> = {}) {
  const form = new FormData()
  form.set('artistSlug', 'alex-rivera')
  form.set('clientName', 'María García')
  form.set('clientEmail', 'maria@example.com')
  form.set('description', 'Minimalist rose')
  form.set('preferredDate', '2026-05-15')
  form.set('bodyZone', 'brazo')
  form.set('size', 'mediano')
  for (const [key, value] of Object.entries(overrides)) {
    form.set(key, value)
  }
  return form
}

function requestWith(form: FormData) {
  return new NextRequest('http://localhost:3000/api/bookings', {
    method: 'POST',
    body: form,
  })
}

function imageFile(name: string, type: string, size = 1024) {
  return new File([new Uint8Array(size)], name, { type })
}

const REAL_ARTIST = { id: 'artist-1', slug: 'alex-rivera' }

describe('POST /api/bookings — upload hardening', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    uploadMock.mockResolvedValue({ data: { path: 'x' }, error: null })
    getPublicUrlMock.mockReturnValue({ data: { publicUrl: 'https://cdn/x' } })
    vi.mocked(prisma.artist.findUnique).mockResolvedValue(REAL_ARTIST as never)
    vi.mocked(createBooking).mockResolvedValue({
      success: true,
      booking: { id: 'b1' },
      statusCode: 201,
    } as never)
  })

  it('returns 404 and never touches Storage when the slug does not exist', async () => {
    vi.mocked(prisma.artist.findUnique).mockResolvedValue(null)
    const form = buildForm({ artistSlug: 'ghost-artist' })
    form.append('image_0', imageFile('a.png', 'image/png'))

    const response = await POST(requestWith(form))

    expect(response.status).toBe(404)
    expect(uploadMock).not.toHaveBeenCalled()
    expect(createBooking).not.toHaveBeenCalled()
  })

  it('rejects an invalid artistSlug at validation, before any DB or Storage call', async () => {
    const form = buildForm({ artistSlug: '../escape' })

    const response = await POST(requestWith(form))

    expect(response.status).toBe(400)
    expect(prisma.artist.findUnique).not.toHaveBeenCalled()
    expect(uploadMock).not.toHaveBeenCalled()
  })

  it('rejects a disallowed MIME type without uploading anything', async () => {
    const form = buildForm()
    form.append('image_0', imageFile('page.html', 'text/html'))

    const response = await POST(requestWith(form))

    expect(response.status).toBe(400)
    expect(uploadMock).not.toHaveBeenCalled()
    expect(createBooking).not.toHaveBeenCalled()
  })

  it('rejects an oversized file without uploading anything', async () => {
    const form = buildForm()
    form.append('image_0', imageFile('big.png', 'image/png', 2 * 1024 * 1024 + 1))

    const response = await POST(requestWith(form))

    expect(response.status).toBe(400)
    expect(uploadMock).not.toHaveBeenCalled()
  })

  it('rejects more files than the per-booking cap without uploading anything', async () => {
    const form = buildForm()
    for (let i = 0; i < 6; i++) {
      form.append(`image_${i}`, imageFile(`a${i}.png`, 'image/png'))
    }

    const response = await POST(requestWith(form))

    expect(response.status).toBe(400)
    expect(uploadMock).not.toHaveBeenCalled()
  })

  it('uploads valid files with their real content type and creates the booking', async () => {
    const form = buildForm()
    form.append('image_0', imageFile('a.png', 'image/png'))
    form.append('image_1', imageFile('b.webp', 'image/webp'))

    const response = await POST(requestWith(form))

    expect(response.status).toBe(201)
    expect(uploadMock).toHaveBeenCalledTimes(2)
    const contentTypes = uploadMock.mock.calls.map((call) => call[2]?.contentType)
    expect(contentTypes).toEqual(['image/png', 'image/webp'])
    expect(createBooking).toHaveBeenCalledWith(
      expect.objectContaining({
        artistSlug: 'alex-rivera',
        referenceImages: ['https://cdn/x', 'https://cdn/x'],
      })
    )
  })

  it('still creates a booking with no images', async () => {
    const response = await POST(requestWith(buildForm()))

    expect(response.status).toBe(201)
    expect(uploadMock).not.toHaveBeenCalled()
    expect(createBooking).toHaveBeenCalled()
  })
})
