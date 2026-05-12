'use client'

import { useOptimistic, useState, startTransition } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send } from 'lucide-react'
import { addMessageToBooking } from '@/app/actions/booking-public'

export interface BookingMessageView {
  id: string
  sender: string
  message: string
  createdAt: Date
  read: boolean
}

interface BookingMessageFormProps {
  bookingId: string
  initialMessages: BookingMessageView[]
}

export function BookingMessageForm({ bookingId, initialMessages }: BookingMessageFormProps) {
  const router = useRouter()
  const [newMessage, setNewMessage] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [sendError, setSendError] = useState<string | null>(null)

  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    initialMessages,
    (state, newMsg: BookingMessageView) => [...state, newMsg],
  )

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !clientEmail.trim()) return

    const messageText = newMessage.trim()
    const emailText = clientEmail.trim()
    const tempId = `temp-${Date.now()}`

    setSendError(null)
    setNewMessage('')

    startTransition(async () => {
      addOptimisticMessage({
        id: tempId,
        sender: 'client',
        message: messageText,
        createdAt: new Date(),
        read: false,
      })

      try {
        const result = await addMessageToBooking(bookingId, {
          sender: 'client',
          message: messageText,
          clientEmail: emailText,
        })
        if (!result.ok) {
          if (result.error === 'unauthorized') {
            setSendError('El email no coincide con el de la cita. Comprueba que es el mismo que usaste al solicitarla.')
          } else {
            setSendError('No se pudo enviar el mensaje. Inténtalo de nuevo.')
          }
          return
        }
        router.refresh()
      } catch (error) {
        console.error('Error sending message:', error)
        setSendError('No se pudo enviar el mensaje. Inténtalo de nuevo.')
      }
    })
  }

  return (
    <div className="bg-[#141414] rounded-2xl border border-white/10 p-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-[#ff6b35]" />
        <h3 className="text-lg font-semibold text-white">Comunicación</h3>
      </div>

      <div className="space-y-4 mb-6">
        {optimisticMessages.length === 0 ? (
          <p className="text-[#525252] text-sm">No hay mensajes aún.</p>
        ) : (
          <AnimatePresence>
            {optimisticMessages.map((msg, index) => (
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
        <div className="space-y-1">
          <label htmlFor="client-email" className="block text-xs text-[#a1a1a1]">
            Para verificar tu identidad, escribe el email con el que solicitaste la cita
          </label>
          <input
            id="client-email"
            type="email"
            required
            autoComplete="email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            placeholder="tu@email.com"
            className="w-full p-3 rounded-xl bg-[#0a0a0a] border border-white/10 text-white placeholder:text-[#525252] focus:ring-2 focus:ring-[#ff6b35] focus:border-[#ff6b35] transition-all"
          />
        </div>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="w-full p-4 rounded-xl bg-[#0a0a0a] border border-white/10 text-white placeholder:text-[#525252] resize-none focus:ring-2 focus:ring-[#ff6b35] focus:border-[#ff6b35] transition-all"
          rows={3}
        />
        {sendError && (
          <p role="alert" className="text-sm text-[#ef4444]">
            {sendError}
          </p>
        )}
        <motion.button
          type="submit"
          disabled={!newMessage.trim() || !clientEmail.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 px-4 bg-[#ff6b35] text-black font-medium rounded-xl hover:bg-[#ff8555] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          Enviar mensaje
        </motion.button>
      </form>
    </div>
  )
}
