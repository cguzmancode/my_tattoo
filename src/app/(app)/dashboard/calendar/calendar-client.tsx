'use client'

import { useState, useTransition } from 'react'
import { CalendarView } from '@/components/calendar/calendar-view'
import { blockDate, unblockDateByDate } from '@/app/actions/calendar'
import { getBookingById } from '@/app/actions/bookings'
import { useToast } from '@/components/ui/toast'
import { BookingDetailDrawer } from '@/components/dashboard/booking-detail-drawer'
import type { DashboardBooking } from '@/types/dashboard'
import { useBookingMessages } from '@/hooks/use-booking-messages'

interface CalendarClientProps {
  events: Array<{
    id: string
    date: Date
    type: 'booking'
    title: string
    status: string
  }>
  blockedDates: Date[]
}

export function CalendarClient({ events: initialEvents, blockedDates: initialBlockedDates }: CalendarClientProps) {
  const [events, setEvents] = useState(initialEvents)
  const [blockedDates, setBlockedDates] = useState<Date[]>(initialBlockedDates)
  const [, startTransition] = useTransition()
  const { showToast } = useToast()
  
  // Drawer state
  const [selectedBooking, setSelectedBooking] = useState<DashboardBooking | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const refreshMessages = useBookingMessages(selectedBooking, setSelectedBooking)

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
      const bookingData = await getBookingById(bookingId)

      // getBookingById already returns the Prisma shape the drawer consumes
      const booking: DashboardBooking = bookingData

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
        onRefreshMessages={refreshMessages}
      />
    </>
  )
}
