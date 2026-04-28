'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Calendar, List, CalendarDays, Settings } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: List },
  { href: '/dashboard/bookings', label: 'Citas', icon: Calendar },
  { href: '/dashboard/calendar', label: 'Calendario', icon: CalendarDays },
  { href: '/dashboard/settings', label: 'Ajustes', icon: Settings },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a] border-t border-white/10 safe-area-pb lg:hidden">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors
                ${isActive ? 'text-[#ff6b35]' : 'text-[#a1a1a1]'}
              `}
            >
              <Icon size={22} />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-px w-8 h-0.5 bg-[#ff6b35] rounded-b-full"
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}