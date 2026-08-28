import * as React from 'react'
import { Text } from '@react-email/components'
import { BookingEmailTemplate } from './base'

interface BookingAcceptedProps {
  clientName: string
  bookingId: string
  artistName: string
  proposedDate: Date | string
  priceEstimate?: number
  bodyZone?: string
  size?: string
  description?: string
}

export function BookingAcceptedTemplate({ clientName, bookingId, artistName, proposedDate, priceEstimate, bodyZone, size, description }: BookingAcceptedProps) {
  const formattedDate = proposedDate instanceof Date
    ? proposedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date(proposedDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <BookingEmailTemplate clientName={clientName} bookingId={bookingId} artistName={artistName} bodyZone={bodyZone} size={size} description={description}>
      <Text style={{ fontSize: '18px', fontWeight: 'bold', color: '#16a34a', marginBottom: '16px' }}>
        ✓ Tu cita ha sido aceptada
      </Text>
      <Text style={{ fontSize: '16px', color: '#333', marginBottom: '16px' }}>
        ¡Buenas noticias! El artista {artistName} ha aceptado tu solicitud.
      </Text>
      <Text style={{ fontSize: '16px', color: '#333', marginBottom: '16px' }}>
        <strong>Fecha propuesta:</strong> {formattedDate}
      </Text>
      {priceEstimate && (
        <Text style={{ fontSize: '16px', color: '#333', marginBottom: '16px' }}>
          <strong>Precio estimado:</strong> {priceEstimate}€
        </Text>
      )}
      <Text style={{ fontSize: '16px', color: '#333', marginBottom: '16px' }}>
        Te notifyaremos cuando confirmes la fecha para proceder con el pago del depósito.
      </Text>
    </BookingEmailTemplate>
  )
}
