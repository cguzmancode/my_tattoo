'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { formatDistanceToNow } from '@/lib/utils'

interface TattooBookingCardProps {
  booking: {
    id: string
    clientName: string
    clientEmail: string
    bodyZone: string
    size: string
    description: string
    status: 'PENDING' | 'ACCEPTED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
    createdAt: Date | string
  }
  onClick?: () => void
}

// Configuración de badges por estado
const statusConfig = {
  PENDING: {
    bg: 'bg-[#eab308]/10',
    text: 'text-[#eab308]',
    border: 'border-[#eab308]/30',
    label: 'Pendiente',
  },
  ACCEPTED: {
    bg: 'bg-[#00d4ff]/10',
    text: 'text-[#00d4ff]',
    border: 'border-[#00d4ff]/30',
    label: 'Aceptada',
  },
  CONFIRMED: {
    bg: 'bg-[#22c55e]/10',
    text: 'text-[#22c55e]',
    border: 'border-[#22c55e]/30',
    label: 'Confirmada',
  },
  CANCELLED: {
    bg: 'bg-[#ef4444]/10',
    text: 'text-[#ef4444]',
    border: 'border-[#ef4444]/30',
    label: 'Cancelada',
  },
  COMPLETED: {
    bg: 'bg-[#525252]/20',
    text: 'text-[#a1a1a1]',
    border: 'border-white/10',
    label: 'Completada',
  },
}

// Icono de zona corporal
const BodyZoneIcon = ({ zone }: { zone: string }) => {
  const getPath = () => {
    const lower = zone.toLowerCase()
    if (lower.includes('arm') || lower.includes('brazo')) {
      // Brazo
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
          <path d="M7 4C7 4 5 8 5 12C5 16 7 20 7 20" />
          <path d="M7 4C7 4 9 6 9 8" />
          <circle cx="7" cy="3" r="1.5" fill="currentColor" />
        </svg>
      )
    }
    if (lower.includes('leg') || lower.includes('pierna')) {
      // Pierna
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
          <path d="M10 4C10 4 8 10 8 16C8 20 10 22 10 22" />
          <path d="M10 4C10 4 12 6 12 8" />
          <circle cx="10" cy="3" r="1.5" fill="currentColor" />
        </svg>
      )
    }
    if (lower.includes('back') || lower.includes('espalda')) {
      // Espalda
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
          <path d="M8 6C8 6 12 5 16 6" />
          <path d="M8 6C8 12 8 16 8 18" />
          <path d="M16 6C16 12 16 16 16 18" />
          <path d="M8 18C10 19 14 19 16 18" />
        </svg>
      )
    }
    if (lower.includes('chest') || lower.includes('pecho')) {
      // Pecho
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
          <path d="M6 10C6 10 8 8 12 8C16 8 18 10 18 10" />
          <path d="M6 10C6 14 8 16 12 16C16 16 18 14 18 10" />
        </svg>
      )
    }
    // Default
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  }

  return <div className="text-[#ff6b35]">{getPath()}</div>
}

// Tamaño visual
const SizeIndicator = ({ size }: { size: string }) => {
  const getDots = () => {
    const lower = size.toLowerCase()
    if (lower.includes('small') || lower.includes('pequeño')) return 1
    if (lower.includes('medium') || lower.includes('mediano')) return 2
    if (lower.includes('large') || lower.includes('grande')) return 3
    return 2
  }

  const dots = getDots()

  return (
    <div className="flex gap-1">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${i <= dots ? 'bg-[#ff6b35]' : 'bg-white/20'}`}
        />
      ))}
    </div>
  )
}

export function TattooBookingCard({ booking, onClick }: TattooBookingCardProps) {
  const config = statusConfig[booking.status]
  const description = booking.description.length > 60
    ? booking.description.slice(0, 60) + '...'
    : booking.description

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onClick}
      className="group relative rounded-xl border border-white/10 bg-[#141414] p-5 hover:border-[#ff6b35]/40 hover:shadow-[0_0_40px_rgba(255,107,53,0.15)] transition-all duration-500 cursor-pointer"
    >
      {/* Top Row: Avatar + Info + Status */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Avatar with Gradient */}
          <div className="relative">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#c0a062] flex items-center justify-center text-black font-bold text-lg shadow-lg">
              {booking.clientName.charAt(0)}
            </div>
            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md bg-[#ff6b35]/50" />
          </div>

          <div>
            <h3 className="font-semibold text-lg text-white group-hover:text-[#ff6b35] transition-colors">
              {booking.clientName}
            </h3>
            <p className="text-[#a1a1a1] text-sm">{booking.clientEmail}</p>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${config.bg} ${config.text} ${config.border}`}
        >
          {config.label}
        </span>
      </div>

      {/* Divider */}
      <div className="my-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Middle: Tattoo Info */}
      <div className="space-y-3">
        {/* Zone & Size */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
            <BodyZoneIcon zone={booking.bodyZone} />
            <span className="text-sm text-white capitalize">{booking.bodyZone}</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
            <SizeIndicator size={booking.size} />
            <span className="text-sm text-white capitalize">{booking.size}</span>
          </div>
        </div>

        {/* Description Preview */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-[#0a0a0a] border border-white/5">
          <span className="text-xl">🎨</span>
          <p className="text-sm text-[#a1a1a1] leading-relaxed italic">
            "{description}"
          </p>
        </div>
      </div>

      {/* Bottom: Metadata + Action */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-[#525252]">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatDistanceToNow(booking.createdAt)}</span>
          </div>
        </div>

        {/* Action Indicator */}
        <div className="flex items-center gap-2 text-sm text-[#ff6b35] opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="font-medium">Ver detalles</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>

      {/* Corner Accent */}
      <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-xl">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-[#ff6b35]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </motion.div>
  )
}
