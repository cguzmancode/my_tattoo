'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, List, CalendarDays, Settings, User } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: List },
  { href: '/dashboard/bookings', label: 'Bookings', icon: Calendar },
  { href: '/dashboard/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold">InkApp</h2>
        <p className="text-gray-400 text-sm">Artist Dashboard</p>
      </div>
      
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
