'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Filter, Search } from 'lucide-react'
import { DEMO_BOOKINGS } from '@/lib/mocks/data'
import { BookingList } from '@/components/dashboard/booking-list'
import { BookingDetailDrawer } from '@/components/dashboard/booking-detail-drawer'

export default function BookingsPage() {
  // En development sin login, usar datos del mock
  const bookings = DEMO_BOOKINGS
  const [selectedBooking, setSelectedBooking] = useState<typeof bookings[0] | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleBookingClick = (booking: typeof bookings[0]) => {
    setSelectedBooking(booking)
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    // Limpiar selectedBooking después de la animación
    setTimeout(() => setSelectedBooking(null), 300)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-3xl font-bold text-white">
            Citas
          </h1>
          <p className="text-[#a1a1a1] mt-1">
            Gestiona las solicitudes de tus clientes
          </p>
        </div>

        {/* Stats summary */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#141414] border border-white/10">
            <Calendar className="w-4 h-4 text-[#ff6b35]" />
            <span className="text-sm text-[#a1a1a1]">
              <span className="text-white font-medium">{bookings.length}</span> total
            </span>
          </div>
        </div>
      </motion.div>

      {/* Filters bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#525252]" />
          <input
            type="text"
            placeholder="Buscar por cliente..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141414] border border-white/10 
                       text-white placeholder-[#525252] text-sm
                       focus:outline-none focus:border-[#ff6b35]/50 focus:ring-1 focus:ring-[#ff6b35]/20
                       transition-all"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#141414] border border-white/10
                       text-[#a1a1a1] text-sm font-medium hover:border-[#ff6b35]/30 hover:text-white
                       transition-all"
          >
            <Filter className="w-4 h-4" />
            Filtrar
          </motion.button>
        </div>
      </motion.div>

      {/* Bookings list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-white/10 bg-[#141414] p-6"
      >
        <BookingList bookings={bookings} />
      </motion.div>
    </div>
  )
}
