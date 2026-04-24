'use client'

import { useState, useTransition } from 'react'
import { CalendarView } from '@/components/calendar/calendar-view'
import { blockDate, unblockDate } from '@/app/actions/calendar'
import { useToast } from '@/components/ui/toast'
import { unblockDateByDate } from '@/app/actions/calendar'

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

export function CalendarClient({ events, blockedDates: initialBlockedDates, artistId }: CalendarClientProps) {
  const [blockedDates, setBlockedDates] = useState<Date[]>(initialBlockedDates)
  const [isPending, startTransition] = useTransition()
  const { showToast } = useToast()

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
30:             prev.filter((d) => d.toDateString() !== date.toDateString())
31:           )
32:           showToast('Día desbloqueado correctamente', 'success')
33:         } else {
34:           showToast(result.error || 'Error al desbloquear el día', 'error')
35:         }
36:       } catch (error) {
37:         console.error('[CalendarClient] Error unblocking date:', error)
38:         showToast('Error de conexión', 'error')
39:       }
40:     })
41:   }

42:   const handleBookingMove = async (bookingId: string, newDate: Date) => {
43:     startTransition(async () => {
44:       try {
45:         await updateBookingDate(bookingId, newDate.toISOString().split('T')[0])
46:         showToast('Cita reprogramada correctamente', 'success')
47:       } catch (error) {
48:         console.error('[CalendarClient] Error moving booking:', error)
49:         showToast('Error al reprogramar la cita', 'error')
50:       }
51:     })
52:   }

44:   return (
45:     <CalendarView
46:       events={events}
47:       blockedDates={blockedDates}
48:       onDateClick={handleDateClick}
49:       onBlockDate={handleBlockDate}
50:       onUnblockDate={handleUnblockDate}
51:       onBookingMove={handleBookingMove}
52:     />
53:   )
54: }
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

  return (
    <CalendarView
      events={events}
      blockedDates={blockedDates}
      onBlockDate={handleBlockDate}
      onUnblockDate={handleUnblockDate}
    />
  )
}
