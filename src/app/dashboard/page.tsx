'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, DollarSign, TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { DEMO_BOOKINGS, DEMO_STATS } from '@/lib/mocks'
import { StatusBadge } from '@/components/dashboard/status-badge'

const stats = [
  { 
    label: 'Total Citas', 
    value: DEMO_STATS.totalBookings, 
    icon: Calendar,
    change: '+12%',
    changeType: 'positive' as const
  },
  { 
    label: 'Pendientes', 
    value: DEMO_STATS.pendingBookings, 
    icon: Clock,
    change: '+3',
    changeType: 'neutral' as const
  },
  { 
    label: 'Confirmadas', 
    value: DEMO_STATS.confirmedBookings, 
    icon: DollarSign,
    change: '+8%',
    changeType: 'positive' as const
  },
  { 
    label: 'Esta Semana', 
    value: DEMO_STATS.thisWeek, 
    icon: TrendingUp,
    change: '2 hoy',
    changeType: 'neutral' as const
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

export default function DashboardPage() {
  const recentBookings = DEMO_BOOKINGS.slice(0, 5)

  return (
    <div className="space-y-8">
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
            Resumen de tu estudio
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
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
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
          {recentBookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
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
                    {new Date(booking.preferredDates[0]).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short'
                    })}
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
          ))}
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
          <div className="flex gap-2">
            <code className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-[#a1a1a1] font-mono">
              inkapp.com/t/alex-rivera-tattoo
            </code>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary rounded-lg text-sm px-4"
            >
              Copiar
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
    </div>
  )
}
