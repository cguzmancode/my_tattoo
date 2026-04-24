'use client'

import { useState, useOptimistic, startTransition } from 'react'
import { notFound } from 'next/navigation'
import { getPublicBookingById, addMessageToBooking } from '@/app/actions/booking-public'
import { BookingStatus } from '@prisma/client'
import { MessageCircle, CheckCircle, XCircle, Clock, Calendar, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Booking {
  id: string
  status: BookingStatus
  bodyZone: string
  size: string
  description: string
  proposedDate?: Date
  priceEstimate?: number
  artist: {
    name: string
    email: string
  }
  messages: Array<{
    id: string
    sender: string
    message: string
    createdAt: Date
    read: boolean
  }>
}

interface PageProps {
  params: Promise<{ id: string }>
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const config = {
    PENDING: { icon: Clock, color: 'bg-[#eab308]/20 text-[#eab308] border-[#eab308]/30', label: 'Pendiente' },
    ACCEPTED: { icon: CheckCircle, color: 'bg-[#00d4ff]/20 text-[#00d4ff] border-[#00d4ff]/30', label: 'Aceptada' },
    REJECTED: { icon: XCircle, color: 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/30', label: 'Rechazada' },
    CONFIRMED: { icon: CheckCircle, color: 'bg-[#22c55e]/20 text-[#22c55e] border-[#22c55e]/30', label: 'Confirmada' },
    COMPLETED: { icon: CheckCircle, color: 'bg-[#a1a1a1]/20 text-[#a1a1a1] border-[#a1a1a1]/30', label: 'Completada' },
    CANCELLED: { icon: XCircle, color: 'bg-[#6b7280]/20 text-[#a1a1a1] border-[#6b7280]/30', label: 'Cancelada' },
  }

  const { icon: Icon, color, label } = config[status] || config.PENDING

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${color}`}>
      <Icon className="w-4 h-4" />
      {label}
    </span>
  )
}

export default function BookingPage({ params }: PageProps) {
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  
  // Optimistic messages for immediate UI feedback
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    booking?.messages || [],
    (state, newMsg: { id: string; sender: string; message: string; createdAt: Date; read: boolean }) => [...state, newMsg]
  )

  // Fetch booking data
  useState(() => {
    async function loadBooking() {
      try {
        const { id } = await params
        const data = await getPublicBookingById(id)
        if (data) {
          setBooking(data as Booking)
        }
      } catch (error) {
        console.error('Error loading booking:', error)
      } finally {
        setLoading(false)
      }
    }
    loadBooking()
  })

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!booking || !newMessage.trim()) return

    const messageText = newMessage.trim()
    const tempId = `temp-${Date.now()}`
    
    // Optimistic update
    addOptimisticMessage({
      id: tempId,
      sender: 'client',
      message: messageText,
      createdAt: new Date(),
      read: false,
    })
    
    setNewMessage('')

    // Send to server
    startTransition(async () => {
      try {
        await addMessageToBooking(booking.id, messageText, 'client')
        // Refresh booking data
        const updated = await getPublicBookingById(booking.id)
        if (updated) {
          setBooking(updated as Booking)
        }
      } catch (error) {
        console.error('Error sending message:', error)
      }
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-pulse text-[#a1a1a1]">Cargando...</div>
      </div>
    )
  }

  if (!booking) {
    notFound()
  }

  const messages = optimisticMessages.length > 0 ? optimisticMessages : booking.messages

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white font-display">Seguimiento de tu cita</h1>
          <p className="text-[#a1a1a1] mt-2">ID: {booking.id}</p>
        </div>

        <div className="bg-[#141414] rounded-2xl border border-white/10 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Estado de tu solicitud</h2>
            <StatusBadge status={booking.status} />
          </div>

          <div className="grid gap-4 text-sm">
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-[#a1a1a1]">Artista</span>
              <span className="font-medium text-white">{booking.artist.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-[#a1a1a1]">Zona del cuerpo</span>
              <span className="font-medium text-white">{booking.bodyZone}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-[#a1a1a1]">Tamaño</span>
              <span className="font-medium text-white">{booking.size}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-[#a1a1a1]">Descripción</span>
              <span className="font-medium text-white text-right max-w-xs">{booking.description}</span>
            </div>
            {booking.proposedDate && (
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-[#a1a1a1]">Fecha propuesta</span>
                <span className="font-medium text-white">
                  {new Date(booking.proposedDate).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
            {booking.priceEstimate && (
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-[#a1a1a1]">Precio estimado</span>
                <span className="font-medium text-white">{booking.priceEstimate}€</span>
              </div>
            )}
          </div>
        </div>

        {booking.status === 'REJECTED' && (
          <div className="bg-[#ef4444]/10 rounded-2xl border border-[#ef4444]/30 p-6 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-[#ef4444]" />
              <h3 className="font-semibold text-[#ef4444]">Cita rechazada</h3>
            </div>
            <p className="text-sm text-[#fca5a5]">
              Lo sentimos, el artista no puede aceptar tu solicitud en este momento.
              Puedes enviar un mensaje para coordinar una nueva fecha.
            </p>
          </div>
        )}

        <div className="bg-[#141414] rounded-2xl border border-white/10 p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5 text-[#ff6b35]" />
            <h3 className="text-lg font-semibold text-white">Comunicación</h3>
          </div>
          
          <div className="space-y-4 mb-6">
            {messages.length === 0 ? (
              <p className="text-[#525252] text-sm">No hay mensajes aún.</p>
            ) : (
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-xl ${
                      msg.sender === 'artist' 
                        ? 'bg-[#ff6b35]/10 border border-[#ff6b35]/20 ml-4' 
                        : 'bg-[#00d4ff]/10 border border-[#00d4ff]/20 mr-4'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-sm text-white">
                        {msg.sender === 'artist' ? 'Artista' : 'Tú'}
                      </span>
                      <span className="text-xs text-[#a1a1a1]">
                        {new Date(msg.createdAt).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-white">{msg.message}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="space-y-3">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="w-full p-4 rounded-xl bg-[#0a0a0a] border border-white/10 text-white placeholder:text-[#525252] resize-none focus:ring-2 focus:ring-[#ff6b35] focus:border-[#ff6b35] transition-all"
              rows={3}
            />
            <motion.button
              type="submit"
              disabled={!newMessage.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 bg-[#ff6b35] text-black font-medium rounded-xl hover:bg-[#ff8555] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Enviar mensaje
            </motion.button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <a
            href={`mailto:${booking.artist.email}`}
            className="text-sm text-[#a1a1a1] hover:text-[#ff6b35] transition-colors"
          >
            Contactar al artista directamente
          </a>
        </div>
      </div>
    </div>
  )
}
