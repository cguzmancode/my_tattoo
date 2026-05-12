import { notFound } from 'next/navigation'
import { CheckCircle, Clock, XCircle } from 'lucide-react'
import type { BookingStatus } from '@prisma/client'
import { getPublicBookingById } from '@/app/actions/booking-public'
import { BookingMessageForm } from './booking-message-form'

interface PageProps {
  params: Promise<{ id: string }>
}

const STATUS_CONFIG: Record<
  BookingStatus,
  { icon: typeof CheckCircle; color: string; label: string }
> = {
  PENDING: { icon: Clock, color: 'bg-[#eab308]/20 text-[#eab308] border-[#eab308]/30', label: 'Pendiente' },
  ACCEPTED: { icon: CheckCircle, color: 'bg-[#00d4ff]/20 text-[#00d4ff] border-[#00d4ff]/30', label: 'Aceptada' },
  REJECTED: { icon: XCircle, color: 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/30', label: 'Rechazada' },
  CONFIRMED: { icon: CheckCircle, color: 'bg-[#22c55e]/20 text-[#22c55e] border-[#22c55e]/30', label: 'Confirmada' },
  COMPLETED: { icon: CheckCircle, color: 'bg-[#a1a1a1]/20 text-[#a1a1a1] border-[#a1a1a1]/30', label: 'Completada' },
  CANCELLED: { icon: XCircle, color: 'bg-[#6b7280]/20 text-[#a1a1a1] border-[#6b7280]/30', label: 'Cancelada' },
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const { icon: Icon, color, label } = STATUS_CONFIG[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${color}`}>
      <Icon className="w-4 h-4" />
      {label}
    </span>
  )
}

export default async function BookingPage({ params }: PageProps) {
  const { id } = await params
  const booking = await getPublicBookingById(id)

  if (!booking) {
    notFound()
  }

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

        <BookingMessageForm
          bookingId={booking.id}
          initialMessages={booking.messages.map((m) => ({
            id: m.id,
            sender: m.sender,
            message: m.message,
            createdAt: m.createdAt,
            read: m.read,
          }))}
        />

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
