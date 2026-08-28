import * as React from 'react'
import { Html, Head, Body, Container, Section, Text, Link, Hr } from '@react-email/components'

interface BaseEmailProps {
  children: React.ReactNode
}

export function BaseEmailTemplate({ children }: BaseEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#f5f5f5', fontFamily: 'system-ui, sans-serif' }}>
        <Container style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '32px', marginTop: '32px', marginBottom: '32px', maxWidth: '600px' }}>
          <Section>
            <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '8px' }}>
              🎨 InkApp
            </Text>
            <Hr style={{ borderColor: '#e5e5e5', margin: '16px 0' }} />
            {children}
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

interface BookingEmailProps {
  clientName: string
  bookingId: string
  artistName: string
  bodyZone?: string
  size?: string
  description?: string
  children?: React.ReactNode
}

export function BookingEmailTemplate({ clientName, bookingId, artistName, bodyZone, size, description, children }: BookingEmailProps) {
  return (
    <BaseEmailTemplate>
      <Text style={{ fontSize: '16px', color: '#333', marginBottom: '16px' }}>
        Hola {clientName},
      </Text>
      {children}
      <Section style={{ backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '16px', marginTop: '24px' }}>
        <Text style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
          <strong>Artista:</strong> {artistName}
        </Text>
        {bodyZone && (
          <Text style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
            <strong>Zona del cuerpo:</strong> {bodyZone}
          </Text>
        )}
        {size && (
          <Text style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
            <strong>Tamaño:</strong> {size}
          </Text>
        )}
        {description && (
          <Text style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
            <strong>Descripción:</strong> {description}
          </Text>
        )}
        <Text style={{ fontSize: '14px', color: '#666', marginTop: '16px' }}>
          <strong>ID de cita:</strong> {bookingId}
        </Text>
      </Section>
      <Text style={{ fontSize: '14px', color: '#666', marginTop: '24px' }}>
        Puedes hacer seguimiento a tu cita en: <Link href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/booking/${bookingId}`}>{process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/booking/{bookingId}</Link>
      </Text>
    </BaseEmailTemplate>
  )
}
