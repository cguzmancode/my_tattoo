'use client'

import { motion } from 'framer-motion'
import { CalendarX, Search, Inbox, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface EmptyStateProps {
  type: 'bookings' | 'search' | 'calendar' | 'error'
  title?: string
  description?: string
  action?: {
    label: string
    href: string
  }
}

const icons = {
  bookings: Inbox,
  search: Search,
  calendar: CalendarX,
  error: AlertCircle,
}

const defaultContent: Record<string, { title: string; description: string; action?: { label: string; href: string } }> = {
  bookings: {
    title: 'No tienes citas',
    description: 'Cuando los clientes soliciten citas, aparecerán aquí. Comparte tu perfil para empezar a recibir solicitudes.',
    action: { label: 'Ver mi perfil público', href: '/dashboard/settings' },
  },
  search: {
    title: 'No se encontraron resultados',
    description: 'Intenta con otros términos de búsqueda o filtros diferentes.',
  },
  calendar: {
    title: 'No hay eventos este mes',
    description: 'No tienes citas programadas para este mes. Las citas confirmadas aparecerán en el calendario.',
  },
  error: {
    title: 'Algo salió mal',
    description: 'No pudimos cargar los datos. Intenta recargar la página.',
  },
}

export function EmptyState({ type, title, description, action }: EmptyStateProps) {
  const Icon = icons[type]
  const content = defaultContent[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="h-20 w-20 rounded-full bg-[#ff6b35]/10 flex items-center justify-center mb-6">
        <Icon className="h-10 w-10 text-[#ff6b35]" />
      </div>

      <h3 className="font-display text-xl font-bold text-white mb-2">
        {title || content.title}
      </h3>

      <p className="text-[#a1a1a1] max-w-md mb-6">
        {description || content.description}
      </p>

      {(action || content.action) && (
        <Link href={action?.href || content.action?.href || '#'}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary rounded-lg px-6 py-3"
          >
            {action?.label || content.action?.label}
          </motion.button>
        </Link>
      )}
    </motion.div>
  )
}

// Specialized empty states
export function EmptyBookings() {
  return (
    <EmptyState
      type="bookings"
      action={{ label: 'Compartir mi perfil', href: '/dashboard' }}
    />
  )
}

export function EmptySearchResults({ query }: { query: string }) {
  return (
    <EmptyState
      type="search"
      title="No se encontraron resultados"
      description={`No hay citas que coincidan con "${query}". Intenta con otros términos de búsqueda.`}
    />
  )
}

export function EmptyCalendar() {
  return (
    <EmptyState
      type="calendar"
      action={{ label: 'Ver solicitudes pendientes', href: '/dashboard/bookings' }}
    />
  )
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="h-20 w-20 rounded-full bg-[#ef4444]/10 flex items-center justify-center mb-6">
        <AlertCircle className="h-10 w-10 text-[#ef4444]" />
      </div>

      <h3 className="font-display text-xl font-bold text-white mb-2">
        Algo salió mal
      </h3>

      <p className="text-[#a1a1a1] max-w-md mb-6">
        No pudimos cargar los datos. Esto puede ser temporal. Intenta recargar la página.
      </p>

      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRetry}
          className="btn-primary rounded-lg px-6 py-3"
        >
          Intentar de nuevo
        </motion.button>
      )}
    </motion.div>
  )
}
