import { notFound } from 'next/navigation'
import { getPublicBookingById, addMessageToBooking } from '@/app/actions/booking-public'
import { BookingStatus } from '@prisma/client'
import { MessageCircle, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react'

function StatusBadge({ status }: { status: BookingStatus }) {
  const config = {
    PENDING: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', label: 'Pendiente' },
    ACCEPTED: { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Aceptada' },
    REJECTED: { icon: XCircle, color: 'bg-red-100 text-red-800', label: 'Rechazada' },
    CONFIRMED: { icon: CheckCircle, color: 'bg-blue-100 text-blue-800', label: 'Confirmada' },
    COMPLETED: { icon: CheckCircle, color: 'bg-purple-100 text-purple-800', label: 'Completada' },
    CANCELLED: { icon: XCircle, color: 'bg-gray-100 text-gray-800', label: 'Cancelada' },
  }

  const { icon: Icon, color, label } = config[status] || config.PENDING

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${color}`}>
      <Icon className="w-4 h-4" />
      {label}
    </span>
  )
}

async function MessageThread({ bookingId, messages }: { bookingId: string, messages: Array<{ id: string, sender: string, message: string, createdAt: Date, read: boolean }> }) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Mensajes</h3>
      <div className="space-y-4">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay mensajes aún.</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-4 rounded-lg ${
                msg.sender === 'artist' ? 'bg-amber-50 border border-amber-200 ml-4' : 'bg-blue-50 border border-blue-200 mr-4'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium text-sm text-gray-700">
                  {msg.sender === 'artist' ? 'Artista' : 'Tú'}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(msg.createdAt).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="text-gray-700">{msg.message}</p>
            </div>
          ))
        )}
      </div>

      {messages.length === 0 || messages[messages.length - 1].sender === 'artist' ? (
        <form action={async (formData) => {
          'use server'
          const message = formData.get('message') as string
          if (message?.trim()) {
            await addMessageToBooking(bookingId, message, 'client')
          }
        }} className="mt-4">
          <textarea
            name="message"
            placeholder="Escribe tu respuesta..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            rows={3}
          />
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Enviar mensaje
          </button>
        </form>
      ) : null}
    </div>
  )
}

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const booking = await getPublicBookingById(id)

  if (!booking) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Seguimiento de tu cita</h1>
          <p className="text-gray-600 mt-2">ID: {booking.id}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Estado de tu solicitud</h2>
            <StatusBadge status={booking.status} />
          </div>

          <div className="grid gap-4 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Artista</span>
              <span className="font-medium text-gray-900">{booking.artist.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Zona del cuerpo</span>
              <span className="font-medium text-gray-900">{booking.bodyZone}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Tamaño</span>
              <span className="font-medium text-gray-900">{booking.size}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Descripción</span>
              <span className="font-medium text-gray-900 text-right max-w-xs">{booking.description}</span>
            </div>
            {booking.proposedDate && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Fecha propuesta</span>
                <span className="font-medium text-gray-900">
                  {new Date(booking.proposedDate).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
            {booking.priceEstimate && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Precio estimado</span>
                <span className="font-medium text-gray-900">{booking.priceEstimate}€</span>
              </div>
            )}
          </div>
        </div>

        {booking.status === 'REJECTED' && (
          <div className="bg-red-50 rounded-xl border border-red-200 p-6 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-red-900">Cita rechazada</h3>
            </div>
            <p className="text-sm text-red-700">
              Lo sentimos, el artista no puede aceptar tu solicitud en este momento.
              Puedes enviar un mensaje para coordinar una nueva fecha.
            </p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-900">Comunicación</h3>
          </div>
          <MessageThread bookingId={booking.id} messages={booking.messages as Array<{ id: string, sender: string, message: string, createdAt: Date, read: boolean }>} />
        </div>

        <div className="mt-6 text-center">
          <a
            href={`mailto:${booking.artist.email}`}
            className="text-sm text-gray-500 hover:text-amber-600 transition-colors"
          >
            Contactar al artista directamente
          </a>
        </div>
      </div>
    </div>
  )
}
