'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Filter, Search, AlertCircle } from 'lucide-react'
import { BookingList } from '@/components/dashboard/booking-list'
import { BookingDetailDrawer } from '@/components/dashboard/booking-detail-drawer'
import { MockBooking } from '@/lib/mocks'

type BookingStatus = 'PENDING' | 'ACCEPTED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'

interface BookingsClientProps {
  initialBookings: MockBooking[]
  isDemo?: boolean
}

const statusFilters: { value: BookingStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Todas' },
  { value: 'PENDING', label: 'Pendientes' },
  { value: 'ACCEPTED', label: 'Aceptadas' },
  { value: 'CONFIRMED', label: 'Confirmadas' },
  { value: 'COMPLETED', label: 'Completadas' },
  { value: 'CANCELLED', label: 'Canceladas' },
]

export function BookingsClient({ initialBookings, isDemo }: BookingsClientProps) {
  const [selectedBooking, setSelectedBooking] = useState<MockBooking | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL')

  const filteredBookings = useMemo(() => {
    let result = [...initialBookings]

    // Filter by status
    if (statusFilter !== 'ALL') {
      result = result.filter((b) => b.status === statusFilter)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (b) =>
          b.clientName.toLowerCase().includes(query) ||
          b.clientEmail.toLowerCase().includes(query) ||
          b.bodyZone.toLowerCase().includes(query)
      )
    }

    return result
  }, [initialBookings, statusFilter, searchQuery])

  const handleBookingClick = (booking: MockBooking) => {
    setSelectedBooking(booking)
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setTimeout(() => setSelectedBooking(null), 300)
  }

  return (
    <div className="space-y-8">
      {/* Demo Mode Alert */}
      {isDemo && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 flex items-start gap-3"
        >
          <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-200 font-medium">Modo Demo</p>
            <p className="text-amber-200/70 text-sm">
              Estás viendo datos de demostración. Inicia sesión para ver tus datos reales.
            </p>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Citas</h1>
          <p className="text-[#a1a1a1] mt-1">
            Gestiona las solicitudes de tus clientes
          </p>
        </div>

        {/* Stats summary */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#141414] border border-white/10">
            <Calendar className="w-4 h-4 text-[#ff6b35]" />
            <span className="text-sm text-[#a1a1a1]">
              <span className="text-white font-medium">{filteredBookings.length}</span> total
            </span>
          </div>
        </div>
      </motion.div>

      {/* Filters bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col gap-4"
      >
        {/* Search and filter row */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#525252]" />
            <input
              type="text"
              placeholder="Buscar por cliente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141414] border border-white/10
                text-white placeholder-[#525252] text-sm
                focus:outline-none focus:border-[#ff6b35]/50 focus:ring-1 focus:ring-[#ff6b35]/20
                transition-all"
            />
          </div>
        </div>

        {/* Status filter buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-[#525252] mr-1" />
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                statusFilter === filter.value
                  ? 'bg-[#ff6b35] text-black'
                  : 'bg-[#141414] border border-white/10 text-[#a1a1a1] hover:border-[#ff6b35]/30 hover:text-white'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Bookings list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-white/10 bg-[#141414] p-6"
      >
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#a1a1a1] mb-2">No se encontraron citas</p>
            <p className="text-[#525252] text-sm">
              {searchQuery
                ? 'Intenta con otros términos de búsqueda'
                : 'No tienes citas con este filtro'}
            </p>
          </div>
        ) : (
          <BookingList
            bookings={filteredBookings}
            onBookingClick={handleBookingClick}
          />
        )}
      </motion.div>

      {/* Booking Detail Drawer */}
      <BookingDetailDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        booking={selectedBooking}
      />
    </div>
  )
}
