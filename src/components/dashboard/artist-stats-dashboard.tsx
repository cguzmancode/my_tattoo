'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Calendar, CheckCircle, Star, DollarSign, Users } from 'lucide-react'
import Image from 'next/image'

interface ArtistStatsDashboardProps {
  bookingsThisMonth: number
  bookingsTrend: number // percentage
  completedWorks: number
  totalWorksTrend: number
  rating: number
  ratingCount: number
  revenueThisMonth: number
  revenueTrend: number
  newClients: number
  recentWorks: { id: string; image: string; title: string; date: string }[]
}

// Star Rating Component - Tattoo Styled
const StarRating = ({ rating, count }: { rating: number; count: number }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.div
            key={star}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: star * 0.1 }}
            className="relative"
          >
            <svg
              className={`h-6 w-6 ${star <= Math.round(rating) ? 'text-[#ff6b35]' : 'text-white/20'}`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              {/* Star shape with inner detail */}
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              {star <= Math.round(rating) && (
                <>
                  <circle cx="12" cy="12" r="2" fill="rgba(0,0,0,0.3)" />
                  <circle cx="12" cy="12" r="1" fill="rgba(255,255,255,0.5)" />
                </>
              )}
            </svg>
          </motion.div>
        ))}
      </div>
      <div>
        <span className="text-2xl font-bold text-white">{rating.toFixed(1)}</span>
        <span className="text-sm text-[#a1a1a1] ml-1">({count} reseñas)</span>
      </div>
    </div>
  )
}

// Mini Sparkline Chart Component
const SparklineChart = ({ data, color = '#ff6b35' }: { data: number[]; color?: string }) => {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = 100 - ((value - min) / range) * 100
    return `${x},${y}`
  }).join(' ')

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      <polygon
        fill="url(#sparklineGradient)"
        points={`0,100 ${points} 100,100`}
      />
      {/* End dot */}
      <circle
        cx={points.split(' ').pop()?.split(',')[0]}
        cy={points.split(' ').pop()?.split(',')[1]}
        r="3"
        fill={color}
      />
    </svg>
  )
}

// Stat Card Component
const StatCard = ({
  icon: Icon,
  label,
  value,
  trend,
  trendLabel,
  sparklineData,
  color = '#ff6b35',
  delay = 0,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  trend: number
  trendLabel: string
  sparklineData?: number[]
  color?: string
  delay?: number
}) => {
  const isPositive = trend >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="group relative rounded-xl border border-white/10 bg-[#141414] p-5 card-glow overflow-hidden"
    >
      {/* Inner glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 inner-glow pointer-events-none" />

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="h-5 w-5" style={{ color }} />
          </div>
          <div>
            <p className="text-sm text-[#a1a1a1]">{label}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
        </div>
        
        <div className={`flex items-center gap-1 text-xs ${isPositive ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
          <TrendingUp className={`h-3 w-3 ${!isPositive && 'rotate-180'}`} />
          <span>{isPositive ? '+' : ''}{trend}%</span>
        </div>
      </div>

      {/* Sparkline */}
      {sparklineData && (
        <div className="mt-4 h-12">
          <SparklineChart data={sparklineData} color={color} />
        </div>
      )}

      <p className="mt-3 text-xs text-[#525252]">{trendLabel}</p>
    </motion.div>
  )
}

// Recent Works Grid
const RecentWorksGrid = ({ works }: { works: { id: string; image: string; title: string; date: string }[] }) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {works.slice(0, 6).map((work, index) => (
        <motion.div
          key={work.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer"
        >
          <Image
            src={work.image}
            alt={work.title}
            fill
            sizes="(max-width: 768px) 33vw, 200px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-2 left-2 right-2">
              <p className="text-xs text-white font-medium truncate">{work.title}</p>
              <p className="text-[10px] text-[#a1a1a1]">{work.date}</p>
            </div>
          </div>
          <div className="absolute inset-0 rounded-lg ring-2 ring-[#ff6b35]/0 group-hover:ring-[#ff6b35]/50 transition-all duration-300" />
        </motion.div>
      ))}
    </div>
  )
}

export function ArtistStatsDashboard({
  bookingsThisMonth = 12,
  bookingsTrend = 15,
  completedWorks = 48,
  totalWorksTrend = 8,
  rating = 4.8,
  ratingCount = 36,
  revenueThisMonth = 2400,
  revenueTrend = 12,
  newClients = 8,
  recentWorks = [],
}: ArtistStatsDashboardProps) {
  // Sample data for sparklines
  const bookingsData = [8, 12, 7, 14, 10, 16, 12]
  const revenueData = [1800, 2100, 1900, 2300, 2200, 2600, 2400]

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Calendar}
          label="Citas este mes"
          value={bookingsThisMonth}
          trend={bookingsTrend}
          trendLabel="vs mes anterior"
          sparklineData={bookingsData}
          color="#ff6b35"
          delay={0}
        />
        
        <StatCard
          icon={CheckCircle}
          label="Trabajos completados"
          value={completedWorks}
          trend={totalWorksTrend}
          trendLabel="vs mes anterior"
          color="#22c55e"
          delay={0.1}
        />
        
        <StatCard
          icon={DollarSign}
          label="Ingresos este mes"
          value={`$${revenueThisMonth.toLocaleString()}`}
          trend={revenueTrend}
          trendLabel="vs mes anterior"
          sparklineData={revenueData}
          color="#00d4ff"
          delay={0.2}
        />
        
        <StatCard
          icon={Users}
          label="Nuevos clientes"
          value={newClients}
          trend={25}
          trendLabel="vs mes anterior"
          color="#c0a062"
          delay={0.3}
        />
      </div>

      {/* Bottom Section: Rating + Recent Works */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rating Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-white/10 bg-[#141414] p-6 card-glow"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-[#ff6b35]/20 flex items-center justify-center">
              <Star className="h-5 w-5 text-[#ff6b35]" />
            </div>
            <h3 className="font-semibold text-white">Valoración</h3>
          </div>
          
          <StarRating rating={rating} count={ratingCount} />
          
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-sm text-[#a1a1a1]">
              Tu trabajo ha sido valorado por <span className="text-white font-medium">{ratingCount}</span> clientes este mes
            </p>
          </div>
        </motion.div>

        {/* Recent Works Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 rounded-xl border border-white/10 bg-[#141414] p-6 card-glow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#c0a062]/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-[#c0a062]" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Trabajos recientes</h3>
                <p className="text-sm text-[#a1a1a1]">Últimas piezas completadas</p>
              </div>
            </div>
            <span className="text-xs text-[#a1a1a1] bg-white/5 px-2 py-1 rounded-full">
              {completedWorks} total
            </span>
          </div>
          
          {recentWorks.length > 0 ? (
            <RecentWorksGrid works={recentWorks} />
          ) : (
            <div className="text-center py-8 text-[#525252]">
              No hay trabajos recientes para mostrar
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
