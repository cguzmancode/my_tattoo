import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BookingList } from '@/components/dashboard/booking-list'
import { BookingStatus } from '@prisma/client'

import type { MockBooking } from '@/lib/mocks'

describe('BookingList', () => {
  const mockBookings: MockBooking[] = [
    {
      id: '1',
      clientName: 'María García',
      clientEmail: 'maria@example.com',
      clientPhone: '+34 600 000 001',
      bodyZone: 'brazo',
      size: 'mediano',
      description: 'Minimalist rose',
      style: 'Fine line',
      referenceImages: [],
      preferredDates: [new Date('2026-06-01')],
      status: BookingStatus.PENDING,
      depositPaid: false,
      createdAt: new Date('2026-05-01'),
      updatedAt: new Date('2026-05-01'),
      artistId: 'demo-artist-001',
      payments: [],
    },
    {
      id: '2',
      clientName: 'Carlos López',
      clientEmail: 'carlos@example.com',
      clientPhone: '+34 600 000 002',
      bodyZone: 'espalda',
      size: 'grande',
      description: 'Dragon tattoo',
      style: 'Japanese',
      referenceImages: [],
      preferredDates: [new Date('2026-06-02')],
      status: BookingStatus.ACCEPTED,
      depositPaid: false,
      createdAt: new Date('2026-05-02'),
      updatedAt: new Date('2026-05-02'),
      artistId: 'demo-artist-001',
      payments: [
        {
          id: 'p1',
          bookingId: '2',
          stripePaymentIntentId: 'pi_test_2',
          amount: 2000,
          status: 'PENDING',
          createdAt: new Date('2026-05-02'),
          updatedAt: new Date('2026-05-02'),
        },
      ],
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