import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BookingList } from '@/components/dashboard/booking-list'
import { BookingStatus } from '@prisma/client'

describe('BookingList', () => {
  const mockBookings = [
    {
      id: '1',
      clientName: 'María García',
      clientEmail: 'maria@example.com',
      bodyZone: 'brazo',
      size: 'mediano',
      description: 'Minimalist rose',
      status: BookingStatus.PENDING,
      createdAt: new Date('2026-05-01'),
      payments: [],
    },
    {
      id: '2',
      clientName: 'Carlos López',
      clientEmail: 'carlos@example.com',
      bodyZone: 'espalda',
      size: 'grande',
      description: 'Dragon tattoo',
      status: BookingStatus.ACCEPTED,
      createdAt: new Date('2026-05-02'),
      payments: [{ id: 'p1', status: 'PENDING', amount: 2000 }],
    },
  ]

  it('should render list of bookings', () => {
    render(<BookingList bookings={mockBookings} />)

    expect(screen.getByText('María García')).toBeInTheDocument()
    expect(screen.getByText('Carlos López')).toBeInTheDocument()
    expect(screen.getByText('Pendiente')).toBeInTheDocument()
    expect(screen.getByText('Aceptada')).toBeInTheDocument()
  })

  it('should render empty state when no bookings', () => {
    render(<BookingList bookings={[]} />)

    expect(screen.getByText('No bookings yet')).toBeInTheDocument()
  })

  it('should display booking details', () => {
    const singleBooking = [mockBookings[0]]
    render(<BookingList bookings={singleBooking} />)

    expect(screen.getByText('maria@example.com')).toBeInTheDocument()
    expect(screen.getByText('brazo')).toBeInTheDocument()
    expect(screen.getByText('mediano')).toBeInTheDocument()
  })
})