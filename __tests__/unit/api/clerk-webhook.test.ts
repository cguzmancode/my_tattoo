// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { Webhook } from 'svix'

vi.mock('@/lib/api/webhooks/clerk', () => ({
  handleClerkWebhook: vi.fn().mockResolvedValue({ success: true, statusCode: 200 }),
}))

import { POST } from '@/app/api/webhooks/clerk/route'
import { handleClerkWebhook } from '@/lib/api/webhooks/clerk'

// svix secrets are base64 after the whsec_ prefix
const SECRET = 'whsec_' + Buffer.from('test-signing-key-0123456789abcdef').toString('base64')

function signedRequest(rawBody: string, { tamperBody }: { tamperBody?: string } = {}) {
  const msgId = 'msg_test_1'
  const timestamp = new Date()
  const signature = new Webhook(SECRET).sign(msgId, timestamp, rawBody)

  return new NextRequest('http://localhost:3000/api/webhooks/clerk', {
    method: 'POST',
    body: tamperBody ?? rawBody,
    headers: {
      'Content-Type': 'application/json',
      'svix-id': msgId,
      'svix-timestamp': String(Math.floor(timestamp.getTime() / 1000)),
      'svix-signature': signature,
    },
  })
}

const EVENT = JSON.stringify({ type: 'user.created', data: { id: 'user_1' } })

describe('POST /api/webhooks/clerk — signature verification', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('CLERK_WEBHOOK_SECRET', SECRET)
  })

  it('accepts a payload signed over the exact raw body', async () => {
    const response = await POST(signedRequest(EVENT))

    expect(response.status).toBe(200)
    expect(handleClerkWebhook).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'user.created' })
    )
  })

  it('rejects a body that differs from the signed bytes', async () => {
    const tampered = JSON.stringify({ type: 'user.created', data: { id: 'user_EVIL' } })

    const response = await POST(signedRequest(EVENT, { tamperBody: tampered }))

    expect(response.status).toBe(401)
    expect(handleClerkWebhook).not.toHaveBeenCalled()
  })

  it('verifies even when raw bytes would not survive JSON re-serialization', async () => {
    // Extra whitespace is preserved by text() but destroyed by
    // JSON.parse + JSON.stringify — the old implementation failed here.
    const spaced = '{ "type": "user.created",   "data": { "id": "user_1" } }'

    const response = await POST(signedRequest(spaced))

    expect(response.status).toBe(200)
  })

  it('rejects requests with missing svix headers', async () => {
    const request = new NextRequest('http://localhost:3000/api/webhooks/clerk', {
      method: 'POST',
      body: EVENT,
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST(request)

    expect(response.status).toBe(400)
    expect(handleClerkWebhook).not.toHaveBeenCalled()
  })
})
