'use client'

import { useState, useTransition } from 'react'
import { CalendarView } from '@/components/calendar/calendar-view'
import { blockDate, unblockDateByDate } from '@/app/actions/calendar'
import { getBookingById } from '@/app/actions/bookings'
import { useToast } from '@/components/ui/toast'
import { BookingDetailDrawer } from '@/components/dashboard/booking-detail-drawer'
import { MockBooking } from '@/lib/mocks'

interface CalendarClientProps {
  events: Array<{
    id: string
    date: Date
    type: 'booking'
    title: string
    status: string
  }>
  blockedDates: Date[]
  artistId: string
}

export function CalendarClient({ events: initialEvents, blockedDates: initialBlockedDates, artistId }: CalendarClientProps) {
  const [events, setEvents] = useState(initialEvents)
  const [blockedDates, setBlockedDates] = useState<Date[]>(initialBlockedDates)
  const [isPending, startTransition] = useTransition()
  const { showToast } = useToast()
  
  // Drawer state
  const [selectedBooking, setSelectedBooking] = useState<MockBooking | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleBlockDate = async (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    const reason = 'Bloqueado manualmente'

    console.log('[CalendarClient] Blocking date:', dateString)

    startTransition(async () => {
      try {
        await blockDate({ date: dateString, reason })

        setBlockedDates((prev) => [...prev, date])
        showToast('Día bloqueado correctamente', 'success')
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Error al bloquear el día'
        console.error('[CalendarClient] Error blocking date:', message)
        showToast(message, 'error')
      }
    })
  }

  const handleUnblockDate = async (date: Date) => {
    const dateString = date.toISOString().split('T')[0]

    console.log('[CalendarClient] Unblocking date:', dateString)

    startTransition(async () => {
      try {
        const result = await unblockDateByDate({ date: dateString })

        if (result.success) {
          setBlockedDates((prev) =>
            prev.filter((d) => d.toDateString() !== date.toDateString())
          )
          showToast('Día desbloqueado correctamente', 'success')
        } else {
          showToast(result.error || 'Error al desbloquear el día', 'error')
        }
      } catch (error) {
        console.error('[CalendarClient] Error unblocking date:', error)
        showToast('Error de conexión', 'error')
      }
    })
  }

  const handleBookingClick = async (bookingId: string) => {
    try {
      // Fetch full booking data
      const bookingData = await getBookingById(bookingId)
      
      // Transform payments to expected format
      const transformedPayments = (bookingData.payments || []).map((p: any) => ({
        id: p.id,
        bookingId: p.bookingId,
        stripePaymentIntentId: p.stripePaymentIntentId,
        amount: p.amount,
        status: p.status === 'CAPTURED' ? 'COMPLETED' : p.status as 'PENDING' | 'COMPLETED' | 'CANCELLED',
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
      }))

      // Transform to MockBooking format expected by drawer
      const booking: MockBooking = {
        id: bookingData.id,
        clientName: bookingData.clientName,
        clientEmail: bookingData.clientEmail,
        clientPhone: bookingData.clientPhone ?? '',
        bodyZone: bookingData.bodyZone,
        size: bookingData.size,
        description: bookingData.description,
        style: '',
        referenceImages: bookingData.referenceImages || [],
        preferredDates: (bookingData.preferredDates || []).map((d: string) => new Date(d)),
        status: bookingData.status as any,
        depositPaid: bookingData.depositPaid,
        createdAt: new Date(bookingData.createdAt),
        updatedAt: new Date(bookingData.updatedAt),
        artistId: bookingData.artistId,
        payments: transformedPayments,
        proposedDate: bookingData.proposedDate ? new Date(bookingData.proposedDate) : undefined,
        priceEstimate: bookingData.priceEstimate || undefined,
        durationEstimate: bookingData.durationEstimate || undefined,
        artistNotes: bookingData.artistNotes || undefined,
      }
      
      setSelectedBooking(booking)
      setIsDrawerOpen(true)
    } catch (error) {
      console.error('Error fetching booking:', error)
      showToast('Error al cargar la cita', 'error')
    }
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedBooking(null)
  }

const handleBookingUpdate = (bookingId: string, newDate?: Date) => {
  if (newDate) {
    // Optimistic update - update UI immediately
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === bookingId ? { ...event, date: newDate } : event
      )
    )
    showToast('Cita reprogramada correctamente', 'success')
  }
}

  return (
    <>
      <CalendarView
        events={events}
        blockedDates={blockedDates}
        onBlockDate={handleBlockDate}
        onUnblockDate={handleUnblockDate}
        onBookingClick={handleBookingClick}
      />
      
      <BookingDetailDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        booking={selectedBooking}
        onBookingUpdated={handleBookingUpdate}
      />
    </>
  )
}
