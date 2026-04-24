'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'
import { BlockedIcon, TattooNeedleIcon } from '@/components/icons/tattoo-icons'
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent,
} from '@dnd-kit/core'

interface CalendarEvent {
  id: string
  date: Date
  type: 'booking'
  title: string
  status?: string
}

interface CalendarViewProps {
  events?: CalendarEvent[]
  blockedDates?: Date[]
  onDateClick?: (date: Date) => void
  onBlockDate?: (date: Date) => void
  onUnblockDate?: (date: Date) => void
  onBookingMove?: (bookingId: string, newDate: Date) => void
}

// Componente para eventos arrastrables
function DraggableEvent({ id, title }: { id: string; title: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 100,
  } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`truncate rounded px-1.5 py-0.5 text-xs font-medium bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/20 cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50' : ''}`}
    >
      {title}
    </div>
  )
}

// Componente para zonas de drop (días del calendario)
function DroppableDay({ date, children, className }: { date: Date; children: React.ReactNode; className?: string }) {
  const { isOver, setNodeRef } = useDroppable({
    id: date.toISOString(),
  })

  return (
    <div
      ref={setNodeRef}
      className={`${className} ${isOver ? 'ring-2 ring-[#ff6b35] ring-offset-2 ring-offset-[#141414]' : ''}`}
    >
      {children}
    </div>
  )
}

export function CalendarView({
  events = [],
  blockedDates = [],
  onDateClick,
  onBlockDate,
  onUnblockDate,
  onBookingMove
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    const bookingId = active.id as string
    const targetDate = new Date(over.id as string)

    // Only move if dropped on a different date
    const activeEvent = events.find(e => e.id === bookingId)
    if (activeEvent && !isSameDay(new Date(activeEvent.date), targetDate)) {
      onBookingMove?.(bookingId, targetDate)
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 bg-[#141414] p-6 relative overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#ff6b35]/5 rounded-full blur-[100px]" />

        {/* Header */}
        <div className="mb-6 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <motion.h2
              key={format(currentDate, 'MMMM yyyy', { locale: es })}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-display font-bold text-white capitalize"
            >
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </motion.h2>
            <div className="flex items-center gap-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToPrevMonth}
                data-testid="calendar-prev"
                className="rounded-lg p-2 text-[#a1a1a1] transition-colors hover:bg-white/5 hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToToday}
                data-testid="calendar-today"
                className="rounded-lg px-3 py-2 text-sm font-label tracking-wider text-[#a1a1a1] transition-colors hover:bg-white/5 hover:text-white uppercase"
              >
                Hoy
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToNextMonth}
                data-testid="calendar-next"
                className="rounded-lg p-2 text-[#a1a1a1] transition-colors hover:bg-white/5 hover:text-white"
              >
                <ChevronRight className="h-5 w-5" />
              </motion.button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 107, 53, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              data-testid="block-date-button"
              className="flex items-center gap-2 rounded-lg bg-[#ff6b35] px-4 py-2 text-sm font-label tracking-wider text-black transition-colors hover:bg-[#ff8555] uppercase btn-glow"
            >
              <BlockedIcon className="h-4 w-4" />
              Bloquear
            </motion.button>
          </div>
        </div>

        {/* Week day headers */}
        <div className="mb-2 grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-xs font-label tracking-widest uppercase text-[#525252]"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <motion.div
          layout
          className="grid grid-cols-7 gap-1"
        >
          <AnimatePresence mode="popLayout">
            {days.map((day, index) => {
              const dayEvents = getEventsForDate(day)
              const blocked = isBlocked(day)
              const isCurrentMonth = isSameMonth(day, currentDate)
              const isToday = isSameDay(day, new Date())
              const isSelected = selectedDate && isSameDay(day, selectedDate)
              const isHovered = hoveredDate && isSameDay(day, hoveredDate)

              return (
                <motion.div
                  key={day.toISOString()}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.01 }}
                >
                  <DroppableDay
                    date={day}
                    className={`
                      relative min-h-[100px] cursor-pointer rounded-xl border p-2 transition-all duration-300
                      ${isCurrentMonth ? 'bg-[#0a0a0a] border-white/5' : 'bg-[#0a0a0a]/50 border-transparent'}
                      ${isToday ? 'ring-2 ring-[#ff6b35] ring-offset-2 ring-offset-[#141414]' : ''}
                      ${isSelected ? 'bg-white/5 border-[#ff6b35]/50' : ''}
                      ${blocked ? 'bg-red-500/5 border-red-500/20' : ''}
                      ${isHovered ? 'border-[#ff6b35]/30 bg-white/5' : ''}
                      hover:border-[#ff6b35]/30 hover:bg-white/5
                    `}
                  >
                    <div
                      onClick={() => handleDateClick(day)}
                      onMouseEnter={() => setHoveredDate(day)}
                      onMouseLeave={() => setHoveredDate(null)}
                    >
                      {/* Day number */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`
                            text-sm font-medium
                            ${isToday ? 'text-[#ff6b35] font-bold' : isCurrentMonth ? 'text-white' : 'text-[#525252]'}
                            ${blocked ? 'text-red-400' : ''}
                          `}
                        >
                          {format(day, 'd')}
                        </span>

                        {/* Block/unblock toggle */}
                        {isCurrentMonth && (
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => handleBlockToggle(day, e)}
                            className={`
                              rounded p-1 transition-colors
                              ${blocked ? 'text-red-400 hover:bg-red-500/20' : 'text-[#525252] hover:text-[#ff6b35]'}
                            `}
                            title={blocked ? 'Desbloquear fecha' : 'Bloquear fecha'}
                          >
                            {blocked ? <BlockedIcon className="h-3.5 w-3.5" /> : <TattooNeedleIcon className="h-3.5 w-3.5" />}
                          </motion.button>
                        )}
                      </div>

                      {/* Events */}
                      <div className="mt-1 space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <DraggableEvent
                            key={event.id}
                            id={event.id}
                            title={event.title}
                          />
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-[#525252]">
                            +{dayEvents.length - 2} más
                          </div>
                        )}
                      </div>

                      {/* Hover glow effect */}
                      {isHovered && (
                        <motion.div
                          layoutId="dayHover"
                          className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#ff6b35]/10 to-transparent pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}

                      {/* Selected glow */}
                      {isSelected && (
                        <motion.div
                          layoutId="daySelected"
                          className="absolute inset-0 rounded-xl bg-[#ff6b35]/5 pointer-events-none"
                        />
                      )}
                    </div>
                  </DroppableDay>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>

        {/* Legend */}
        <div className="mt-6 flex items-center gap-8 text-sm relative z-10">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#00d4ff]/20 ring-1 ring-[#00d4ff]" />
            <span className="text-[#a1a1a1]">Citas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500/20 ring-1 ring-red-500" />
            <span className="text-[#a1a1a1]">Bloqueado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full ring-2 ring-[#ff6b35]" />
            <span className="text-[#a1a1a1]">Hoy</span>
          </div>
        </div>
      </motion.div>
    </DndContext>
  )
}
