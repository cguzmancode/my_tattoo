'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, DollarSign, TrendingUp, ArrowRight, AlertCircle, ExternalLink, Copy, Check } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { StatusBadge } from '@/components/dashboard/status-badge'
import { ArtistStatsDashboard } from '@/components/dashboard/artist-stats-dashboard'
import { EmptyBookings } from '@/components/ui/empty-state'
import { useToast } from '@/components/ui/toast'
import { MockBooking } from '@/lib/mocks'
import { BookingDetailDrawer } from '@/components/dashboard/booking-detail-drawer'
import { useBookingMessages } from '@/hooks/use-booking-messages'

interface Artist {
  id: string
  name: string
  slug: string
  bio?: string | null
  styles?: string[] | null
  depositAmount?: number | null
  instagramUrl?: string | null
}

interface Stats {
  totalBookings: number
  pendingBookings: number
  acceptedBookings: number
  confirmedBookings: number
  cancelledBookings: number
  thisWeek: number
  thisMonth: number
}

interface Booking {
  id: string
  clientName: string
  clientEmail: string
  clientPhone?: string | null
  bodyZone: string
  size: string
  description: string
  style?: string
  referenceImages: string[]
  preferredDates: Date[]
  status: 'PENDING' | 'ACCEPTED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  createdAt: Date
  updatedAt: Date
  artistId: string
}

interface DashboardClientProps {
  artist: Artist
  bookings: Booking[]
  stats: Stats
  isDemo?: boolean
}

export function DashboardClient({ artist, bookings, stats, isDemo }: DashboardClientProps) {
  const { showToast } = useToast()
  const [copied, setCopied] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<MockBooking | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const refreshMessages = useBookingMessages(selectedBooking, setSelectedBooking)

  const handleOpenBooking = (booking: Booking) => {
    setSelectedBooking(booking as unknown as MockBooking)
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedBooking(null)
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`inkapp.com/t/${artist.slug}`)
      setCopied(true)
      showToast('¡Enlace copiado!', 'success')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      showToast('Error al copiar', 'error')
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: `Reserva tu cita con ${artist.name} en InkApp`,
      text: `Reserva tu cita de tatuaje con ${artist.name} directamente online.`,
      url: `https://inkapp.com/t/${artist.slug}`,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      handleCopyLink()
    }
  }

  const statItems = [
    {
      label: 'Total Citas',
      value: stats.totalBookings,
      icon: Calendar,
      change: `+${stats.thisMonth}`,
      changeType: 'positive' as const,
    },
    {
      label: 'Pendientes',
      value: stats.pendingBookings,
      icon: Clock,
      change: `${stats.pendingBookings} nuevas`,
      changeType: 'neutral' as const,
    },
    {
      label: 'Confirmadas',
      value: stats.confirmedBookings,
      icon: DollarSign,
      change: `${stats.confirmedBookings} activas`,
      changeType: 'positive' as const,
    },
    {
      label: 'Esta Semana',
      value: stats.thisWeek,
      icon: TrendingUp,
      change: `${stats.thisWeek} nuevas`,
      changeType: 'neutral' as const,
    },
  ]

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
            <p className="text-amber-200 font-medium">
              Modo Demo
            </p>
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
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-display text-3xl font-bold text-white">
            Dashboard
          </h1>
          <p className="text-[#a1a1a1] mt-1">
            {isDemo ? 'Vista previa del dashboard' : `Resumen de tu estudio, ${artist.name}`}
          </p>
        </div>
        <Link href="/dashboard/bookings">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 btn-primary rounded-lg text-sm"
          >
            Ver todas las citas
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statItems.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative rounded-2xl border border-white/10 bg-[#141414] p-6 group overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#ff6b35]/10 rounded-full blur-3xl group-hover:bg-[#ff6b35]/20 transition-colors duration-500" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-[#ff6b35]/10 flex items-center justify-center text-[#ff6b35] group-hover:bg-[#ff6b35]/20 transition-colors">
                  <stat.icon className="h-6 w-6" />
                </div>
                <span className={`
                  text-xs font-medium px-2 py-1 rounded-full
                  ${stat.changeType === 'positive' ? 'bg-green-500/10 text-green-400' : 'bg-[#ff6b35]/10 text-[#ff6b35]'}
                `}>
                  {stat.change}
                </span>
              </div>

              <h3 className="font-label text-sm tracking-wider text-[#a1a1a1] mb-1">
                {stat.label}
              </h3>
              <p className="font-display text-3xl font-bold text-white">
                {stat.value}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-white/10 bg-[#141414] overflow-hidden"
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-white">
              Citas Recientes
            </h2>
            <p className="text-[#a1a1a1] text-sm mt-1">
              Últimas solicitudes de tus clientes
            </p>
          </div>
          <Link href="/dashboard/bookings">
            <motion.button
              whileHover={{ x: 5 }}
              className="text-[#ff6b35] hover:text-[#ff8555] text-sm font-medium flex items-center gap-1"
            >
              Ver todas
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </Link>
        </div>

      <div className="divide-y divide-white/10">
        {bookings.length === 0 ? (
          <EmptyBookings />
        ) : (
          bookings.map((booking, index) => (
<motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  onClick={() => handleOpenBooking(booking)}
                  className="p-6 flex items-center justify-between group hover:bg-white/5 transition-colors cursor-pointer"
                >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#c0a062] flex items-center justify-center text-black font-bold text-lg">
                    {booking.clientName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium text-white group-hover:text-[#ff6b35] transition-colors">
                      {booking.clientName}
                    </h3>
                    <p className="text-sm text-[#a1a1a1]">
                      {booking.bodyZone} • {booking.size}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm text-[#a1a1a1]">
                      {(booking as any).proposedDate
                        ? new Date((booking as any).proposedDate).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short'
                          })
                        : booking.preferredDates[0]
                          ? new Date(booking.preferredDates[0]).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short'
                            })
                          : 'Sin fecha'
                      }
                    </p>
                  </div>
                  <StatusBadge status={booking.status} />

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="text-[#525252] group-hover:text-[#ff6b35] transition-colors"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#ff6b35]/10 to-transparent p-6">
      <h3 className="font-display text-lg font-bold text-white mb-2">
        Comparte tu perfil
      </h3>
      <p className="text-[#a1a1a1] text-sm mb-4">
        Envía tu enlace a clientes para que puedan solicitar citas directamente.
      </p>
      <div className="flex gap-2 mb-3">
        <code className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-[#a1a1a1] font-mono truncate">
          inkapp.com/t/{artist.slug}
        </code>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopyLink}
          className="btn-primary rounded-lg text-sm px-4 flex items-center gap-2"
          title="Copiar enlace"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copiado' : 'Copiar'}
        </motion.button>
      </div>
      <div className="flex gap-2">
        <Link href={`/t/${artist.slug}`} target="_blank" className="flex-1">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Ver mi perfil público
          </motion.button>
        </Link>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="flex items-center gap-2 rounded-lg border border-[#ff6b35]/50 bg-[#ff6b35]/10 px-4 py-2 text-sm text-[#ff6b35] hover:bg-[#ff6b35]/20 transition-colors"
          title="Compartir"
        >
          <ArrowRight className="h-4 w-4" />
          Compartir
        </motion.button>
      </div>
    </div>

        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#00d4ff]/10 to-transparent p-6">
          <h3 className="font-display text-lg font-bold text-white mb-2">
            Configura tu calendario
          </h3>
          <p className="text-[#a1a1a1] text-sm mb-4">
            Marca tus días no disponibles para que los clientes lo vean al solicitar.
          </p>
          <Link href="/dashboard/calendar">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary rounded-lg text-sm"
            >
          Ir al calendario
          </motion.button>
        </Link>
      </div>
    </motion.div>

      {/* Booking Detail Drawer */}
      <BookingDetailDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        booking={selectedBooking}
        onRefreshMessages={refreshMessages}
      />
    </div>
)
}
