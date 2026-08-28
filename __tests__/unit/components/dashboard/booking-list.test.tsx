import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BookingList } from '@/components/dashboard/booking-list'
import { BookingStatus } from '@prisma/client'

import type { DashboardBooking } from '@/types/dashboard'

describe('BookingList', () => {
  const mockBookings: DashboardBooking[] = [
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
      preferredDates: ['2026-06-01'],
      status: BookingStatus.PENDING,
      proposedDate: null,
      priceEstimate: null,
      durationEstimate: null,
      artistNotes: null,
      reminderSent24h: false,
      reminderSent48h: false,
      createdAt: new Date('2026-05-01'),
      updatedAt: new Date('2026-05-01'),
      artistId: 'demo-artist-001',
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
      preferredDates: ['2026-06-02'],
      status: BookingStatus.ACCEPTED,
      proposedDate: null,
      priceEstimate: null,
      durationEstimate: null,
      artistNotes: null,
      reminderSent24h: false,
      reminderSent48h: false,
      createdAt: new Date('2026-05-02'),
      updatedAt: new Date('2026-05-02'),
      artistId: 'demo-artist-001',
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