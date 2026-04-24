import * as React from 'react'
import { Text, Link } from '@react-email/components'
import { BookingEmailTemplate } from './base'

interface BookingRejectedProps {
  clientName: string
  bookingId: string
  artistName: string
  rejectionReason?: string
  bodyZone?: string
  size?: string
  description?: string
}

export function BookingRejectedTemplate({ clientName, bookingId, artistName, rejectionReason, bodyZone, size, description }: BookingRejectedProps) {
  return (
    <BookingEmailTemplate clientName={clientName} bookingId={bookingId} artistName={artistName} bodyZone={bodyZone} size={size} description={description}>
      <Text style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc2626', marginBottom: '16px' }}>
        ✗ Tu cita ha sido rechazada
      </Text>
      <Text style={{ fontSize: '16px', color: '#333', marginBottom: '16px' }}>
        Lo sentimos, el artista {artistName} no puede aceptar tu solicitud en este momento.
      </Text>
      {rejectionReason && (
        <Text style={{ fontSize: '16px', color: '#333', marginBottom: '16px', fontStyle: 'italic' }}>
          <strong>Motivo:</strong> {rejectionReason}
        </Text>
      )}
      <Text style={{ fontSize: '16px', color: '#333', marginBottom: '16px' }}>
        Puedes contacter al artista directamente o solicitar una nueva fecha desde tu página de seguimiento.
      </Text>
      <Text style={{ fontSize: '14px', color: '#666', marginTop: '24px' }}>
        Revisa el estado de tu cita y responde al mensaje desde: <Link href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/booking/${bookingId}`}>{process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/booking/{bookingId}</Link>
      </Text>
    </BookingEmailTemplate>
  )
}
