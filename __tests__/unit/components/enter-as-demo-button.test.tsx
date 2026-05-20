import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

const mockEnterAsDemo = vi.fn()
const mockTicket = vi.fn()
const mockFinalize = vi.fn()
const mockPush = vi.fn()

const signInState = {
  fetchStatus: 'idle' as 'idle' | 'fetching',
  signIn: {
    ticket: mockTicket,
    finalize: mockFinalize,
    status: 'complete' as 'needs_identifier' | 'complete',
  },
}

vi.mock('@clerk/nextjs', () => ({
  useSignIn: () => signInState,
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('@/app/actions/demo', () => ({
  enterAsDemo: () => mockEnterAsDemo(),
}))

const { EnterAsDemoButton } = await import('../../../src/components/public/enter-as-demo-button')

describe('<EnterAsDemoButton />', () => {
  beforeEach(() => {
    mockEnterAsDemo.mockReset()
    mockTicket.mockReset()
    mockFinalize.mockReset()
    mockPush.mockReset()
    signInState.fetchStatus = 'idle'
    signInState.signIn.status = 'complete'
  })

  it('renders the demo entry label', () => {
    render(<EnterAsDemoButton />)
    expect(screen.getByRole('button')).toHaveTextContent(/entrar como demo/i)
  })

  it('signs in with the ticket and navigates to /dashboard on success', async () => {
    mockEnterAsDemo.mockResolvedValueOnce({ token: 'sit_xxx' })
    mockTicket.mockResolvedValueOnce({ error: null })
    mockFinalize.mockResolvedValueOnce({ error: null })

    render(<EnterAsDemoButton />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(mockTicket).toHaveBeenCalledWith({ ticket: 'sit_xxx' })
      expect(mockFinalize).toHaveBeenCalled()
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('shows the error message when the server action fails', async () => {
    mockEnterAsDemo.mockResolvedValueOnce({ error: 'Demo is not configured' })

    render(<EnterAsDemoButton />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Demo is not configured')
    })
    expect(mockTicket).not.toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('does not navigate when ticket sign-in returns an error', async () => {
    mockEnterAsDemo.mockResolvedValueOnce({ token: 'sit_xxx' })
    mockTicket.mockResolvedValueOnce({ error: { message: 'bad ticket' } })

    render(<EnterAsDemoButton />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/could not be completed/i)
    })
    expect(mockFinalize).not.toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
  })
})
