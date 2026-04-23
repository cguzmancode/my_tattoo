'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Calendar, List, CalendarDays, Settings } from 'lucide-react'
import { TattooNeedle } from '@/components/icons/tattoo-needle'
import { UserSection } from './user-section'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: List },
  { href: '/dashboard/bookings', label: 'Citas', icon: Calendar },
  { href: '/dashboard/calendar', label: 'Calendario', icon: CalendarDays },
  { href: '/dashboard/settings', label: 'Ajustes', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-72 bg-[#0a0a0a] border-r border-white/10 min-h-screen flex flex-col sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: 15 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <TattooNeedle className="h-8 w-8 text-[#ff6b35]" />
          </motion.div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-bold text-white">
              Ink<span className="text-[#ff6b35]">App</span>
            </span>
            <span className="font-label text-[10px] tracking-[0.3em] text-white/40 -mt-1">
              DASHBOARD
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="mb-4">
          <span className="font-label text-xs tracking-widest text-white/30 px-4">
            MENÚ
          </span>
        </div>
        
        {navItems.map((item, index) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                className={`
                  relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                  ${isActive 
                    ? 'bg-[#ff6b35]/10 text-white' 
                    : 'text-[#a1a1a1] hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#ff6b35] rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                {/* Glow effect for active */}
                {isActive && (
                  <div className="absolute inset-0 rounded-xl bg-[#ff6b35]/5 blur-sm" />
                )}
                
                <Icon 
                  size={20} 
                  className={`
                    relative z-10 transition-colors
                    ${isActive ? 'text-[#ff6b35]' : 'group-hover:text-white'}
                  `} 
                />
                <span className="relative z-10 font-medium">{item.label}</span>
                
                {/* Arrow for active */}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="ml-auto text-[#ff6b35]"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </motion.div>
                )}
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* User Section */}
      <UserSection />
    </aside>
  )
}
