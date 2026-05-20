'use server'

import { clerkClient } from '@clerk/nextjs/server'

const SIGN_IN_TOKEN_TTL_SECONDS = 60

export async function enterAsDemo(): Promise<{ token: string } | { error: string }> {
  const userId = process.env.DEMO_CLERK_USER_ID
  if (!userId) {
    return { error: 'Demo is not configured' }
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
