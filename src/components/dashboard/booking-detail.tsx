'use client'

import { useState } from 'react'
import { BookingStatus } from '@prisma/client'
import { updateBookingStatus } from '@/app/actions/bookings'
import { updateBookingDetails, checkDateConflicts } from '@/app/actions/booking-details'
import { StatusBadge } from './status-badge'
import { formatCurrency } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface BookingDetailProps {
  booking: {
    id: string
    clientName: string
    clientEmail: string
    clientPhone: string | null
    bodyZone: string
    size: string
    description: string
    preferredDates: string[]
    status: BookingStatus
    proposedDate: Date | null
    createdAt: Date
    referenceImages: string[]
    priceEstimate: number | null
    durationEstimate: string | null
    artistNotes: string | null
  }
}

export function BookingDetail({ booking }: BookingDetailProps) {
  const [status, setStatus] = useState(booking.status)
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [conflicts, setConflicts] = useState<any[]>([])
  const [showConflicts, setShowConflicts] = useState(false)
  
  // Editable fields
  const [priceEstimate, setPriceEstimate] = useState(booking.priceEstimate || '')
  const [durationEstimate, setDurationEstimate] = useState(booking.durationEstimate || '')
  const [artistNotes, setArtistNotes] = useState(booking.artistNotes || '')
  const [proposedDate, setProposedDate] = useState(
    booking.proposedDate ? format(new Date(booking.proposedDate), 'yyyy-MM-dd') : ''
  )
  const [proposedTime, setProposedTime] = useState(
    booking.proposedDate ? format(new Date(booking.proposedDate), 'HH:mm') : ''
  )

  const handleStatusChange = async (newStatus: BookingStatus) => {
    setLoading(true)
    try {
      // Si va a confirmar, verificar conflictos
      if (newStatus === 'CONFIRMED' && booking.proposedDate) {
        const { conflicts: foundConflicts } = await checkDateConflicts(
          booking.id,
          new Date(booking.proposedDate)
        )
        if (foundConflicts.length > 0) {
          setConflicts(foundConflicts)
          setShowConflicts(true)
          setLoading(false)
          return
        }
      }
      
      await updateBookingStatus(booking.id, { status: newStatus })
      setStatus(newStatus)
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDetails = async () => {
    setLoading(true)
    try {
      let newProposedDate: Date | undefined
      if (proposedDate && proposedTime) {
        newProposedDate = new Date(`${proposedDate}T${proposedTime}`)
      }

      await updateBookingDetails(booking.id, {
        priceEstimate: priceEstimate ? parseInt(priceEstimate as string) : undefined,
        durationEstimate: durationEstimate || undefined,
        artistNotes: artistNotes || undefined,
        proposedDate: newProposedDate,
      })
      setEditing(false)
    } catch (error) {
      console.error('Failed to update details:', error)
    } finally {
      setLoading(false)
    }
  }

  const canAccept = status === 'PENDING'
  const canConfirm = status === 'ACCEPTED'
  const canReject = status === 'PENDING' || status === 'ACCEPTED'

  return (
    <section className="bg-[#141414] rounded-2xl shadow-lg border border-white/10 p-6 space-y-6" aria-label="Detalles de la reserva">
      {/* Conflict Warning */}
      {showConflicts && conflicts.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-4" role="alert" aria-live="assertive">
          <h3 className="text-amber-400 font-semibold mb-2">⚠️ Conflicto de Fecha</h3>
          <p className="text-amber-200/80 text-sm mb-2">
            Ya tienes {conflicts.length} cita(s) programada(s) para este día:
          </p>
          <ul className="text-amber-200/70 text-sm space-y-1 mb-3">
            {conflicts.map((c) => (
              <li key={c.id}>• {c.clientName} - {c.status}</li>
            ))}
          </ul>
          <p className="text-amber-200/60 text-xs">
            Revisa las citas y contacta con los clientes para reprogramar si es necesario.
          </p>
          <button
            onClick={() => setShowConflicts(false)}
            className="mt-2 text-amber-400 hover:text-amber-300 text-sm font-medium"
          >
            Entendido
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start pb-6 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white">{booking.clientName}</h2>
          <p className="text-zinc-400">{booking.clientEmail}</p>
          {booking.clientPhone && (
            <p className="text-zinc-500 text-sm mt-1">{booking.clientPhone}</p>
          )}
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Editable Details Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Detalles de la Cita</h3>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="text-[#ff6b35] hover:text-[#ff8555] text-sm font-medium"
            >
              Editar
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSaveDetails}
                disabled={loading}
                className="px-3 py-1 bg-[#ff6b35] text-black rounded-lg text-sm font-medium hover:bg-[#ff8555] disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-3 py-1 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Price Estimate */}
          <div>
            <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wide">Presupuesto</h3>
            {editing ? (
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="number"
                  value={priceEstimate}
                  onChange={(e) => setPriceEstimate(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#ff6b35] focus:ring-1 focus:ring-[#ff6b35]/50"
                  placeholder="15000"
                />
                <span className="text-zinc-400">€</span>
              </div>
            ) : (
              <p className="mt-1 text-lg text-white">
                {booking.priceEstimate ? formatCurrency(booking.priceEstimate) : 'Por definir'}
              </p>
            )}
          </div>

          {/* Duration Estimate */}
          <div>
            <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wide">Duración Estimada</h3>
            {editing ? (
              <input
                type="text"
                value={durationEstimate}
                onChange={(e) => setDurationEstimate(e.target.value)}
                className="mt-1 w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#ff6b35] focus:ring-1 focus:ring-[#ff6b35]/50"
                placeholder="Ej: 2 horas"
              />
            ) : (
              <p className="mt-1 text-lg text-white">{booking.durationEstimate || 'Por definir'}</p>
            )}
          </div>

          {/* Proposed Date */}
          <div className="col-span-2">
            <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wide">Fecha Propuesta</h3>
            {editing ? (
              <div className="mt-1 flex gap-2">
                <input
                  type="date"
                  value={proposedDate}
                  onChange={(e) => setProposedDate(e.target.value)}
                  className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#ff6b35] focus:ring-1 focus:ring-[#ff6b35]/50"
                />
                <input
                  type="time"
                  value={proposedTime}
                  onChange={(e) => setProposedTime(e.target.value)}
                  className="w-32 bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#ff6b35] focus:ring-1 focus:ring-[#ff6b35]/50"
                />
              </div>
            ) : (
              <p className="mt-1 text-lg text-white">
                {booking.proposedDate
                  ? format(new Date(booking.proposedDate), "d 'de' MMMM 'a las' HH:mm", { locale: es })
                  : 'Por definir'}
              </p>
            )}
          </div>

          {/* Artist Notes */}
          <div className="col-span-2">
            <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wide">Notas del Artista</h3>
            {editing ? (
              <textarea
                value={artistNotes}
                onChange={(e) => setArtistNotes(e.target.value)}
                rows={3}
                className="mt-1 w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#ff6b35] focus:ring-1 focus:ring-[#ff6b35]/50 resize-none"
                placeholder="Notas sobre el diseño, preferencias del cliente, etc."
              />
            ) : (
              <p className="mt-1 text-zinc-300">{booking.artistNotes || 'Sin notas'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Booking Info */}
      <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
        <div>
          <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wide">Zona del Cuerpo</h3>
          <p className="mt-1 text-lg text-white capitalize">{booking.bodyZone}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wide">Tamaño</h3>
          <p className="mt-1 text-lg text-white capitalize">{booking.size}</p>
        </div>
        <div className="col-span-2">
          <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wide">Descripción</h3>
          <p className="mt-1 text-zinc-300">{booking.description}</p>
        </div>
        <div className="col-span-2">
          <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wide">Fechas Preferidas por el Cliente</h3>
          <div className="mt-1 flex flex-wrap gap-2">
            {booking.preferredDates.map((date) => (
              <span key={date} className="px-3 py-1 bg-white/5 rounded-full text-sm text-zinc-300">
                {new Date(date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-6 border-t border-white/10">
        {canAccept && (
          <button
            onClick={() => handleStatusChange('ACCEPTED')}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Procesando...' : 'Aceptar Cita'}
          </button>
        )}
        {canConfirm && (
          <button
            onClick={() => handleStatusChange('CONFIRMED')}
            disabled={loading}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Procesando...' : 'Confirmar Cita'}
          </button>
        )}
        {canReject && (
          <button
            onClick={() => handleStatusChange('REJECTED')}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Procesando...' : 'Rechazar'}
          </button>
        )}
        <button
          onClick={() => setShowContactModal(true)}
          className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
        >
          Contactar Cliente
        </button>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Contactar a {booking.clientName}</h3>
            <div className="space-y-3 mb-6">
              <div>
                <span className="text-zinc-500 text-sm">Email:</span>
                <p className="text-white">{booking.clientEmail}</p>
              </div>
              {booking.clientPhone && (
                <div>
                  <span className="text-zinc-500 text-sm">Teléfono:</span>
                  <p className="text-white">{booking.clientPhone}</p>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <a
                href={`mailto:${booking.clientEmail}?subject=Cita de Tatuaje - InkApp`}
                className="flex-1 px-4 py-2 bg-[#ff6b35] text-black rounded-lg text-center font-medium hover:bg-[#ff8555] transition-colors"
              >
                Enviar Email
              </a>
              <button
                onClick={() => setShowContactModal(false)}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
