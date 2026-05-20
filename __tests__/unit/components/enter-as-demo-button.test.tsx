import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

const mockEnterAsDemo = vi.fn()
const mockCreate = vi.fn()
const mockSetActive = vi.fn()
const mockPush = vi.fn()

const signInState = {
  isLoaded: true,
  signIn: { create: mockCreate },
  setActive: mockSetActive,
}

vi.mock('@clerk/nextjs/legacy', () => ({
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
    mockCreate.mockReset()
    mockSetActive.mockReset()
    mockPush.mockReset()
    signInState.isLoaded = true
  })

  it('renders the demo entry label', () => {
    render(<EnterAsDemoButton />)
    expect(screen.getByRole('button')).toHaveTextContent(/entrar como demo/i)
  })

  it('signs in via ticket and navigates to /dashboard on success', async () => {
    mockEnterAsDemo.mockResolvedValueOnce({ token: 'sit_xxx' })
    mockCreate.mockResolvedValueOnce({ status: 'complete', createdSessionId: 'sess_1' })

    render(<EnterAsDemoButton />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({ strategy: 'ticket', ticket: 'sit_xxx' })
      expect(mockSetActive).toHaveBeenCalledWith({ session: 'sess_1' })
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
    expect(mockCreate).not.toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('shows an error when signIn.create does not return complete', async () => {
    mockEnterAsDemo.mockResolvedValueOnce({ token: 'sit_xxx' })
    mockCreate.mockResolvedValueOnce({ status: 'needs_first_factor' })

    render(<EnterAsDemoButton />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/could not be completed/i)
    })
    expect(mockSetActive).not.toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('does not call the server action while Clerk is loading', () => {
    signInState.isLoaded = false

    render(<EnterAsDemoButton />)
    fireEvent.click(screen.getByRole('button'))

    expect(mockEnterAsDemo).not.toHaveBeenCalled()
  })
})
