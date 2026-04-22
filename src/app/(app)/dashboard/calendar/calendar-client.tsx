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
