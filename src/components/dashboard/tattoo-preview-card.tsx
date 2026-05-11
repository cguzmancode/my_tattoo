'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Clock, MapPin, Calendar, Palette, ArrowRight } from 'lucide-react'

interface TattooPreviewCardProps {
  booking: {
    id: string
    clientName: string
    clientAvatar?: string
    bodyZone: string
    size: string
    style: string
    description: string
    referenceImage?: string
    preferredDate: string
    duration: string
    status: 'PENDING' | 'ACCEPTED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  }
  onClick?: () => void
}

const statusConfig = {
  PENDING: {
    bg: 'bg-[#eab308]/10',
    text: 'text-[#eab308]',
    border: 'border-[#eab308]/30',
    label: 'Pendiente',
    dot: 'bg-[#eab308]',
  },
  ACCEPTED: {
    bg: 'bg-[#00d4ff]/10',
    text: 'text-[#00d4ff]',
    border: 'border-[#00d4ff]/30',
    label: 'Aceptada',
    dot: 'bg-[#00d4ff]',
  },
  CONFIRMED: {
    bg: 'bg-[#22c55e]/10',
    text: 'text-[#22c55e]',
    border: 'border-[#22c55e]/30',
    label: 'Confirmada',
    dot: 'bg-[#22c55e]',
  },
  REJECTED: {
    bg: 'bg-[#ef4444]/10',
    text: 'text-[#ef4444]',
    border: 'border-[#ef4444]/30',
    label: 'Rechazada',
    dot: 'bg-[#ef4444]',
  },
  CANCELLED: {
    bg: 'bg-[#ef4444]/10',
    text: 'text-[#ef4444]',
    border: 'border-[#ef4444]/30',
    label: 'Cancelada',
    dot: 'bg-[#ef4444]',
  },
  COMPLETED: {
    bg: 'bg-[#525252]/20',
    text: 'text-[#a1a1a1]',
    border: 'border-white/10',
    label: 'Completada',
    dot: 'bg-[#a1a1a1]',
  },
}

// Timeline visual
const SessionTimeline = ({ duration }: { duration: string }) => {
  const getDurationSteps = () => {
    if (duration.includes('1-2') || duration.includes('Small')) return 2
    if (duration.includes('3-4') || duration.includes('Medium')) return 3
    return 4
  }

  const steps = getDurationSteps()

  return (
    <div className="flex items-center gap-1 mt-2">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
            i < steps ? 'bg-[#ff6b35]' : 'bg-white/10'
          }`}
        />
      ))}
      <span className="ml-2 text-xs text-[#a1a1a1]">{duration}</span>
    </div>
  )
}

export function TattooPreviewCard({ booking, onClick }: TattooPreviewCardProps) {
  const config = statusConfig[booking.status]
  const hasImage = !!booking.referenceImage

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onClick}
      className="group relative rounded-xl border border-white/10 bg-[#141414] overflow-hidden cursor-pointer card-glow"
    >
      {/* Inner glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none inner-glow-intense" />

      {/* Image Section */}
      <div className="relative h-40 overflow-hidden">
        {hasImage ? (
          <Image
            src={booking.referenceImage!}
            alt={`${booking.clientName} reference`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#ff6b35]/20 via-[#141414] to-[#c0a062]/20 flex items-center justify-center">
            <Palette className="h-12 w-12 text-[#ff6b35]/50" />
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/50 to-transparent" />

        {/* Style badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-xs text-white border border-white/10">
            {booking.style}
          </span>
        </div>

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full border ${config.bg} ${config.text} ${config.border} text-xs font-medium`}>
            <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
            {config.label}
          </span>
        </div>

        {/* Client info overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#c0a062] flex items-center justify-center text-black font-bold">
              {booking.clientName.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-[#ff6b35] transition-colors">
                {booking.clientName}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Zone & Size */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
            <MapPin className="h-3.5 w-3.5 text-[#ff6b35]" />
            <span className="text-xs text-white capitalize">{booking.bodyZone}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
            <span className="text-xs text-white capitalize">{booking.size}</span>
          </div>
        </div>

        {/* Description preview */}
        <p className="text-sm text-[#a1a1a1] line-clamp-2 italic">
          "{booking.description}"
        </p>

        {/* Timeline */}
        <div className="pt-2 border-t border-white/5">
          <div className="flex items-center justify-between text-xs text-[#525252]">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{booking.preferredDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>Duración estimada</span>
            </div>
          </div>
          <SessionTimeline duration={booking.duration} />
        </div>

        {/* Action hint */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-[#525252]">ID: #{booking.id.slice(-4)}</span>
          <div className="flex items-center gap-1 text-xs text-[#ff6b35] opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Ver detalles</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-[#ff6b35]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </motion.div>
  )
}
