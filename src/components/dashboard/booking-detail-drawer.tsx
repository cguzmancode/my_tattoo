'use client'

import { useEffect, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Phone, Mail, MapPin, Calendar, Clock, DollarSign, Palette, Edit2, CheckCircle, AlertCircle, FileText } from 'lucide-react'
import Image from 'next/image'
import { StatusBadge } from './status-badge'
import { BookingDetailEdit } from './booking-detail-edit'
import { updateBookingStatus } from '@/app/actions/bookings'

import { MockBooking } from '@/lib/mocks'

interface BookingDetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  booking?: MockBooking | null
}

export function BookingDetailDrawer({ isOpen, onClose, booking }: BookingDetailDrawerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState<string | null>(null)
  const [showErrorMessage, setShowErrorMessage] = useState<string | null>(null)
  const [showContactModal, setShowContactModal] = useState(false)

  // Reset editing state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setIsEditing(false)
    }
  }, [isOpen])

  // Cerrar con tecla Escape
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleEscape])

  const handleSave = async (data: {
    status: string
    proposedDate?: string
    priceEstimate?: number
    durationEstimate?: string
    artistNotes?: string
  }) => {
    try {
      // Cast status to BookingStatus enum
      const status = data.status as 'PENDING' | 'ACCEPTED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REJECTED'
      await updateBookingStatus(booking!.id, {
        status,
        proposedDate: data.proposedDate,
        priceEstimate: data.priceEstimate,
        durationEstimate: data.durationEstimate,
        artistNotes: data.artistNotes,
      })
      setShowSuccessMessage('Cita actualizada correctamente')
      setIsEditing(false)
      setTimeout(() => setShowSuccessMessage(null), 3000)
    } catch (error) {
      setShowErrorMessage('Error al guardar los cambios')
      setTimeout(() => setShowErrorMessage(null), 3000)
      throw error
    }
  }

  if (!booking) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-16 bottom-0 w-full sm:w-[480px] bg-[#141414] border-l border-white/10 z-[60] shadow-[-10px_0_40px_rgba(0,0,0,0.5)] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#0a0a0a]/50">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#c0a062] flex items-center justify-center text-black font-bold text-lg">
                  {booking.clientName.charAt(0)}
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-white">
                    {booking.clientName}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={booking.status} />
                    <span className="text-xs text-[#525252]">
                      #{booking.id.slice(-4)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Edit Toggle Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(!isEditing)}
                  className={`p-2 rounded-lg transition-colors ${
                    isEditing
                      ? 'bg-[#ff6b35] text-black'
                      : 'text-[#a1a1a1] hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Edit2 className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-lg text-[#a1a1a1] hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>
            </div>

            {/* Success/Error Messages */}
            <AnimatePresence>
              {showSuccessMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mx-6 mt-4 p-4 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center gap-3"
                >
                  <CheckCircle className="h-5 w-5 text-[#22c55e]" />
                  <p className="text-sm text-[#22c55e]">{showSuccessMessage}</p>
                </motion.div>
              )}
              {showErrorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mx-6 mt-4 p-4 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/20 flex items-center gap-3"
                >
                  <AlertCircle className="h-5 w-5 text-[#ef4444]" />
                  <p className="text-sm text-[#ef4444]">{showErrorMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Body - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              {isEditing ? (
                /* Edit Mode */
                <div className="p-6">
                  <h3 className="font-label text-xs tracking-widest uppercase text-[#ff6b35] mb-6">
                    Editar Cita
                  </h3>
                  <BookingDetailEdit
                    booking={booking}
                    onSave={handleSave}
                    onCancel={() => setIsEditing(false)}
                  />
                </div>
              ) : (
                /* View Mode */
                <>
                  {/* Contact Info Section */}
                  <div className="p-6 border-b border-white/10">
                    <h3 className="font-label text-xs tracking-widest uppercase text-[#ff6b35] mb-4">
                      Información de Contacto
                    </h3>
                    <div className="space-y-3">
                      <a
                        href={`mailto:${booking.clientEmail}`}
                        className="flex items-center gap-3 text-[#a1a1a1] hover:text-white transition-colors group"
                      >
                        <div className="h-10 w-10 rounded-lg bg-[#ff6b35]/10 flex items-center justify-center group-hover:bg-[#ff6b35]/20 transition-colors">
                          <Mail className="h-4 w-4 text-[#ff6b35]" />
                        </div>
                        <div>
                          <p className="text-xs text-[#525252]">Email</p>
                          <p className="text-sm text-white">{booking.clientEmail}</p>
                        </div>
                      </a>
                      {booking.clientPhone && (
                        <a
                          href={`tel:${booking.clientPhone}`}
                          className="flex items-center gap-3 text-[#a1a1a1] hover:text-white transition-colors group"
                        >
                          <div className="h-10 w-10 rounded-lg bg-[#ff6b35]/10 flex items-center justify-center group-hover:bg-[#ff6b35]/20 transition-colors">
                            <Phone className="h-4 w-4 text-[#ff6b35]" />
                          </div>
                          <div>
                            <p className="text-xs text-[#525252]">Teléfono</p>
                            <p className="text-sm text-white">{booking.clientPhone}</p>
                          </div>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Tattoo Details Section */}
                  <div className="p-6 border-b border-white/10">
                    <h3 className="font-label text-xs tracking-widest uppercase text-[#ff6b35] mb-4">
                      Detalles del Tatuaje
                    </h3>
                    <div className="space-y-4">
                      {/* Style */}
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-[#ff6b35]/10 flex items-center justify-center">
                          <Palette className="h-4 w-4 text-[#ff6b35]" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-[#525252]">Estilo</p>
                          <p className="text-sm text-white capitalize">{booking.style || 'No especificado'}</p>
                        </div>
                      </div>

                      {/* Body Zone & Size */}
                      <div className="flex gap-4">
                        <div className="flex-1 flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-[#ff6b35]/10 flex items-center justify-center">
                            <MapPin className="h-4 w-4 text-[#ff6b35]" />
                          </div>
                          <div>
                            <p className="text-xs text-[#525252]">Zona</p>
                            <p className="text-sm text-white capitalize">{booking.bodyZone}</p>
                          </div>
                        </div>
                        <div className="flex-1 flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-[#ff6b35]/10 flex items-center justify-center">
                            <Clock className="h-4 w-4 text-[#ff6b35]" />
                          </div>
                          <div>
                            <p className="text-xs text-[#525252]">Tamaño</p>
                            <p className="text-sm text-white capitalize">{booking.size}</p>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mt-4 p-4 rounded-xl bg-[#0a0a0a] border border-white/5">
                        <p className="text-xs text-[#525252] mb-2">Descripción</p>
                        <p className="text-sm text-[#a1a1a1] italic leading-relaxed">
                          "{booking.description}"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Artist Notes Section (if exists) */}
                  {booking.artistNotes && (
                    <div className="p-6 border-b border-white/10">
                      <h3 className="font-label text-xs tracking-widest uppercase text-[#ff6b35] mb-4">
                        Notas del Artista
                      </h3>
                      <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#ff6b35]/20">
                        <div className="flex items-start gap-3">
                          <FileText className="h-4 w-4 text-[#ff6b35] mt-0.5" />
                          <p className="text-sm text-[#a1a1a1]">{booking.artistNotes}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Price & Duration Section (if exists) */}
                  {(booking.priceEstimate || booking.durationEstimate) && (
                    <div className="p-6 border-b border-white/10">
                      <h3 className="font-label text-xs tracking-widest uppercase text-[#ff6b35] mb-4">
                        Presupuesto
                      </h3>
                      <div className="space-y-3">
                        {booking.priceEstimate && (
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-[#00d4ff]/10 flex items-center justify-center">
                              <DollarSign className="h-4 w-4 text-[#00d4ff]" />
                            </div>
                            <div>
                              <p className="text-xs text-[#525252]">Precio estimado</p>
                              <p className="text-sm text-[#00d4ff] font-medium">€{booking.priceEstimate}</p>
                            </div>
                          </div>
                        )}
                        {booking.durationEstimate && (
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-[#c0a062]/10 flex items-center justify-center">
                              <Clock className="h-4 w-4 text-[#c0a062]" />
                            </div>
                            <div>
                              <p className="text-xs text-[#525252]">Duración estimada</p>
                              <p className="text-sm text-[#c0a062] font-medium">{booking.durationEstimate}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Dates Section */}
                  <div className="p-6 border-b border-white/10">
                    <h3 className="font-label text-xs tracking-widest uppercase text-[#ff6b35] mb-4">
                      Fechas
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-[#ff6b35]/10 flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-[#ff6b35]" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-[#525252]">Fechas preferidas</p>
                          <div className="flex flex-wrap gap-2 mt-1">
{booking.preferredDates.map((date, index) => (
                <span
                key={`date-${index}`}
                                className="px-3 py-1 rounded-full bg-white/5 text-xs text-white border border-white/10"
                              >
                                {new Date(date).toLocaleDateString('es-ES', {
                                  day: 'numeric',
                                  month: 'short',
                                })}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      {booking.proposedDate && (
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-[#00d4ff]/10 flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-[#00d4ff]" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-[#525252]">Fecha propuesta</p>
                            <p className="text-sm text-[#00d4ff]">
                              {new Date(booking.proposedDate).toLocaleDateString('es-ES', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                              })}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reference Images Section */}
                  <div className="p-6 border-b border-white/10">
                    <h3 className="font-label text-xs tracking-widest uppercase text-[#ff6b35] mb-4">
                      Imágenes de Referencia
                    </h3>
                    {booking.referenceImages.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {booking.referenceImages.map((image, index) => (
                          <div
                            key={index}
                            className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group cursor-pointer"
                          >
                            <Image
                              src={image}
                              alt={`Reference ${index + 1}`}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-[#0a0a0a] rounded-xl border border-white/5 border-dashed">
                        <p className="text-sm text-[#525252]">No hay imágenes de referencia</p>
                        <p className="text-xs text-[#525252] mt-1">
                          El cliente no ha subido imágenes
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Deposit Section */}
                  {booking.depositPaid && (
                    <div className="p-6">
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20">
                        <div className="h-10 w-10 rounded-lg bg-[#22c55e]/20 flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-[#22c55e]" />
                        </div>
                        <div>
                          <p className="text-xs text-[#22c55e]">Depósito</p>
                          <p className="text-sm text-white font-medium">Pagado</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer Actions */}
            {!isEditing && (
              <div className="p-6 border-t border-white/10 bg-[#0a0a0a]/50">
                <div className="flex gap-3">
                  {booking.status === 'PENDING' && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSave({ status: 'ACCEPTED' })}
                        className="flex-1 py-3 px-4 rounded-xl bg-[#22c55e] text-black font-medium text-sm hover:bg-[#22c55e]/90 transition-colors"
                      >
                        Aceptar
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSave({ status: 'CANCELLED' })}
                        className="flex-1 py-3 px-4 rounded-xl bg-[#ef4444] text-white font-medium text-sm hover:bg-[#ef4444]/90 transition-colors"
                      >
                        Rechazar
                      </motion.button>
                    </>
                  )}
                  {booking.status === 'ACCEPTED' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSave({ status: 'CONFIRMED' })}
                      className="flex-1 py-3 px-4 rounded-xl bg-[#22c55e] text-black font-medium text-sm hover:bg-[#22c55e]/90 transition-colors"
                    >
                      Confirmar Cita
                    </motion.button>
                  )}
                  {booking.status === 'CONFIRMED' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSave({ status: 'COMPLETED' })}
                      className="flex-1 py-3 px-4 rounded-xl bg-[#c0a062] text-black font-medium text-sm hover:bg-[#c0a062]/90 transition-colors"
                    >
                      Marcar como Completada
                    </motion.button>
                  )}
                </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowContactModal(true)}
                className="w-full mt-3 py-3 px-4 rounded-xl border border-white/10 text-white font-medium text-sm hover:bg-white/5 transition-colors"
              >
                Contactar Cliente
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Contact Modal */}
        {showContactModal && booking && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowContactModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#141414] border border-white/10 rounded-2xl p-6 z-[70] shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-4">Contactar a {booking.clientName}</h3>
              <div className="space-y-3 mb-6">
                <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/10">
                  <p className="text-xs text-[#525252] mb-1">Email</p>
                  <p className="text-white">{booking.clientEmail}</p>
                </div>
                {booking.clientPhone && (
                  <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/10">
                    <p className="text-xs text-[#525252] mb-1">Teléfono</p>
                    <p className="text-white">{booking.clientPhone}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <a
                  href={`mailto:${booking.clientEmail}?subject=Cita de Tatuaje - InkApp`}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#ff6b35] text-black font-medium text-sm text-center hover:bg-[#ff8555] transition-colors"
                >
                  Enviar Email
                </a>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-white font-medium text-sm hover:bg-white/5 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </>
    )}
  </AnimatePresence>
)
}
