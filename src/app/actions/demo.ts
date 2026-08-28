'use server'

import { clerkClient } from '@clerk/nextjs/server'
import { headers } from 'next/headers'
import { clientIpFrom, rateLimitByKey } from '@/lib/rate-limit'

const SIGN_IN_TOKEN_TTL_SECONDS = 60

export async function enterAsDemo(): Promise<{ token: string } | { error: string }> {
  const userId = process.env.DEMO_CLERK_USER_ID
  if (!userId) {
    return { error: 'Demo is not configured' }
  }

  // Este endpoint acuña credenciales reales (aunque sean de la cuenta demo):
  // sin rate limit sería un grifo abierto de sign-in tokens.
  const ip = clientIpFrom(await headers())
  const rateLimit = await rateLimitByKey(`demo-signin:${ip}`, {
    maxRequests: 5,
    windowMs: 60000,
  })
  if (!rateLimit.success) {
    return { error: 'Too many attempts, try again in a minute' }
  }

  try {
    const client = await clerkClient()
    const { token } = await client.signInTokens.createSignInToken({
      userId,
      expiresInSeconds: SIGN_IN_TOKEN_TTL_SECONDS,
    })
    return { token }
  } catch (err) {
    console.error('Demo sign-in token error:', err)
    return { error: 'Could not start demo session' }
  }
}
