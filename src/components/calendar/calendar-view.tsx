'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Lock, Unlock } from 'lucide-react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'

interface CalendarEvent {
  id: string
  date: Date
  type: 'booking' | 'blocked'
  title: string
  status?: string
}

interface CalendarViewProps {
  events?: CalendarEvent[]
  blockedDates?: Date[]
  onDateClick?: (date: Date) => void
  onBlockDate?: (date: Date) => void
  onUnblockDate?: (date: Date) => void
}

export function CalendarView({ 
  events = [], 
  blockedDates = [],
  onDateClick,
  onBlockDate,
  onUnblockDate 
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days = useMemo(() => {
    const daysArray = []
    let day = calendarStart
    while (day <= calendarEnd) {
      daysArray.push(day)
      day = addDays(day, 1)
    }
    return daysArray
  }, [calendarStart, calendarEnd])

  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date))
  }

  const isBlocked = (date: Date) => {
    return blockedDates.some(blocked => isSameDay(new Date(blocked), date))
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    onDateClick?.(date)
  }

  const handleBlockToggle = (date: Date, e: React.MouseEvent) => {
    e.stopPropagation()
    if (isBlocked(date)) {
      onUnblockDate?.(date)
    } else {
      onBlockDate?.(date)
    }
  }

  const goToToday = () => setCurrentDate(new Date())
  const goToPrevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1))

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-white capitalize">
            {format(currentDate, 'MMMM yyyy', { locale: es })}
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={goToPrevMonth}
              data-testid="calendar-prev"
              className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goToToday}
              data-testid="calendar-today"
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
            >
              Hoy
            </button>
            <button
              onClick={goToNextMonth}
              data-testid="calendar-next"
              className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <button
          data-testid="block-date-button"
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
        >
          <Lock className="h-4 w-4" />
          Bloquear fecha
        </button>
      </div>

      {/* Week day headers */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-semibold uppercase tracking-wider text-zinc-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const dayEvents = getEventsForDate(day)
          const blocked = isBlocked(day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isToday = isSameDay(day, new Date())
          const isSelected = selectedDate && isSameDay(day, selectedDate)

          return (
            <div
              key={index}
              onClick={() => handleDateClick(day)}
              className={`
                relative min-h-[100px] cursor-pointer rounded-lg border p-2 transition-all
                ${isCurrentMonth ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-900/50 border-transparent'}
                ${isToday ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-zinc-950' : ''}
                ${isSelected ? 'bg-zinc-800' : ''}
                ${blocked ? 'bg-red-950/20' : ''}
                hover:border-zinc-700 hover:bg-zinc-800
              `}
            >
              {/* Day number */}
              <div className="flex items-center justify-between">
                <span
                  className={`
                    text-sm font-medium
                    ${isToday ? 'text-orange-400' : isCurrentMonth ? 'text-zinc-300' : 'text-zinc-600'}
                    ${blocked ? 'text-red-400' : ''}
                  `}
                >
                  {format(day, 'd')}
                </span>
                
                {/* Block/unblock toggle */}
                {isCurrentMonth && (
                  <button
                    onClick={(e) => handleBlockToggle(day, e)}
                    className={`
                      rounded p-1 transition-colors
                      ${blocked ? 'text-red-400 hover:bg-red-950/50' : 'text-zinc-600 hover:text-zinc-400'}
                    `}
                    title={blocked ? 'Desbloquear fecha' : 'Bloquear fecha'}
                  >
                    {blocked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                  </button>
                )}
              </div>

              {/* Events */}
              <div className="mt-1 space-y-1">
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className={`
                      truncate rounded px-1.5 py-0.5 text-xs font-medium
                      ${event.type === 'booking' ? 'bg-emerald-500/20 text-emerald-400' : ''}
                      ${event.type === 'blocked' ? 'bg-red-500/20 text-red-400' : ''}
                    `}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-zinc-500">
                    +{dayEvents.length - 2} más
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-emerald-500/20 ring-1 ring-emerald-500" />
          <span className="text-zinc-400">Citas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500/20 ring-1 ring-red-500" />
          <span className="text-zinc-400">Bloqueado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full ring-2 ring-orange-500" />
          <span className="text-zinc-400">Hoy</span>
        </div>
      </div>
    </div>
  )
}
