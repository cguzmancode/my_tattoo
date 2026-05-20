import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockCreateSignInToken = vi.fn()

vi.mock('@clerk/nextjs/server', () => ({
  clerkClient: async () => ({
    signInTokens: { createSignInToken: mockCreateSignInToken },
  }),
}))

const { enterAsDemo } = await import('../../../src/app/actions/demo')

describe('enterAsDemo', () => {
  beforeEach(() => {
    mockCreateSignInToken.mockReset()
  })

  it('returns an error when DEMO_CLERK_USER_ID is not configured', async () => {
    delete process.env.DEMO_CLERK_USER_ID

    const result = await enterAsDemo()

    expect(result).toEqual({ error: 'Demo is not configured' })
    expect(mockCreateSignInToken).not.toHaveBeenCalled()
  })

  it('returns a sign-in token when DEMO_CLERK_USER_ID is set', async () => {
    process.env.DEMO_CLERK_USER_ID = 'user_demo_abc'
    mockCreateSignInToken.mockResolvedValueOnce({ token: 'sit_xxx' })

    const result = await enterAsDemo()

    expect(result).toEqual({ token: 'sit_xxx' })
    expect(mockCreateSignInToken).toHaveBeenCalledWith({
      userId: 'user_demo_abc',
      expiresInSeconds: 60,
    })
  })

  it('returns an error when the Clerk SDK rejects', async () => {
    process.env.DEMO_CLERK_USER_ID = 'user_demo_abc'
    mockCreateSignInToken.mockRejectedValueOnce(new Error('clerk down'))

    const result = await enterAsDemo()

    expect(result).toEqual({ error: 'Could not start demo session' })
  })
})
