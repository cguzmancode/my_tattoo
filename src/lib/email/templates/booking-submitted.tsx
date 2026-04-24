import * as React from 'react'
import { Text, Link } from '@react-email/components'
import { BookingEmailTemplate } from './base'

interface BookingSubmittedProps {
  clientName: string
  bookingId: string
  artistName: string
  bodyZone?: string
  size?: string
  description?: string
}

export function BookingSubmittedTemplate({ clientName, bookingId, artistName, bodyZone, size, description }: BookingSubmittedProps) {
  return (
    <BookingEmailTemplate clientName={clientName} bookingId={bookingId} artistName={artistName} bodyZone={bodyZone} size={size} description={description}>
      <Text style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '16px' }}>
        Tu solicitud de cita ha sido recibida
      </Text>
      <Text style={{ fontSize: '16px', color: '#333', marginBottom: '16px' }}>
        Hemos recibido tu solicitud para un tatuaje. El artista {artistName} revisará tu petición y te notifyaremos por email sobre el estado de tu cita.
      </Text>
      <Text style={{ fontSize: '16px', color: '#333', marginBottom: '16px' }}>
        Recibirás un email cuando el artista acepte o rechace tu solicitud.
      </Text>
    </BookingEmailTemplate>
  )
}
