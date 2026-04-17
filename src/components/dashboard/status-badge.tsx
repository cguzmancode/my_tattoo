'use client'

import { motion } from 'framer-motion'

// Usar tipo unión en lugar de importar de Prisma
export type BookingStatus = 'PENDING' | 'ACCEPTED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REJECTED'

interface StatusBadgeProps {
  status: BookingStatus
}

const statusConfig: Record<BookingStatus, { 
  label: string
  bg: string
  text: string
  glow: string
}> = {
  PENDING: {
    label: 'Pendiente',
    bg: 'bg-[#eab308]/10',
    text: 'text-[#eab308]',
    glow: 'shadow-[#eab308]/20',
  },
  ACCEPTED: {
    label: 'Aceptada',
    bg: 'bg-[#00d4ff]/10',
    text: 'text-[#00d4ff]',
    glow: 'shadow-[#00d4ff]/20',
  },
  CONFIRMED: {
    label: 'Confirmada',
    bg: 'bg-[#22c55e]/10',
    text: 'text-[#22c55e]',
    glow: 'shadow-[#22c55e]/20',
  },
  COMPLETED: {
    label: 'Completada',
    bg: 'bg-[#525252]/20',
    text: 'text-[#a1a1a1]',
    glow: 'shadow-transparent',
  },
  CANCELLED: {
    label: 'Cancelada',
    bg: 'bg-[#ef4444]/10',
    text: 'text-[#ef4444]',
    glow: 'shadow-[#ef4444]/20',
  },
  REJECTED: {
    label: 'Rechazada',
    bg: 'bg-[#ef4444]/10',
    text: 'text-[#ef4444]',
    glow: 'shadow-[#ef4444]/20',
  },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
        border border-white/10
        ${config.bg} ${config.text}
        shadow-sm ${config.glow}
        transition-all duration-300
        hover:shadow-lg hover:scale-105
      `}
    >
      <span className={`
        w-1.5 h-1.5 rounded-full mr-2 animate-pulse
        ${status === 'PENDING' ? 'bg-[#eab308]' : 
          status === 'ACCEPTED' ? 'bg-[#00d4ff]' : 
          status === 'CONFIRMED' ? 'bg-[#22c55e]' : 
          status === 'COMPLETED' ? 'bg-[#525252]' : 'bg-[#ef4444]'}
      `} />
      {config.label}
    </motion.span>
  )
}
