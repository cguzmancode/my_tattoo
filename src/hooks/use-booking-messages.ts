'use client'

import { useCallback } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { getBookingById } from '@/app/actions/bookings'
import type { DashboardBooking } from '@/types/dashboard'

type Setter = Dispatch<SetStateAction<DashboardBooking | null>>

/**
 * Re-fetches the selected booking's messages and merges them into the
 * current state. Used by every dashboard surface that opens the booking
 * drawer (dashboard, bookings, calendar) to keep the message thread in
 * sync after the user sends a reply.
 */
export function useBookingMessages(
  selectedBooking: DashboardBooking | null,
  setSelectedBooking: Setter,
) {
  return useCallback(async () => {
    if (!selectedBooking) return

    try {
      const bookingData = await getBookingById(selectedBooking.id)
      setSelectedBooking((prev) =>
        prev ? { ...prev, messages: bookingData.messages ?? [] } : null,
      )
    } catch (error) {
      console.error('Error refreshing messages:', error)
    }
  }, [selectedBooking, setSelectedBooking])
}
