import type { PrismaClient } from '@prisma/client'
import { Resend } from 'resend'
import { sendEmail } from '@/lib/email/resend'
import {
  BookingAcceptedTemplate,
  BookingRejectedTemplate,
  BookingSubmittedTemplate,
} from '@/lib/email/templates'
import type { Booking } from '../domain/booking'
import type { BookingMessage } from '../domain/booking-message'
import { MessageSender } from '../domain/booking-message'
import type { NotificationService } from '../application/ports/notification-service'

export class ResendNotificationService implements NotificationService {
  constructor(private readonly prisma: PrismaClient) {}

  async bookingReceived(booking: Booking): Promise<void> {
    const artist = await this.lookupArtist(booking.artistId)
    if (!artist) return

    await this.safeSend(() =>
      sendEmail({
        to: booking.clientEmail,
        subject: 'Hemos recibido tu solicitud de cita',
        react: BookingSubmittedTemplate({
          clientName: booking.clientName,
          bookingId: booking.id.value,
          artistName: artist.name,
          bodyZone: booking.bodyZone,
          size: booking.size,
          description: booking.description,
        }),
      }),
    )
  }

  async bookingAccepted(booking: Booking): Promise<void> {
    const artist = await this.lookupArtist(booking.artistId)
    if (!artist) return

    await this.safeSend(() =>
      sendEmail({
        to: booking.clientEmail,
        subject: '¡Tu cita ha sido aceptada!',
        react: BookingAcceptedTemplate({
          clientName: booking.clientName,
          bookingId: booking.id.value,
          artistName: artist.name,
          proposedDate: booking.proposedDate?.value ?? new Date(),
          priceEstimate: booking.priceEstimate ?? undefined,
          bodyZone: booking.bodyZone,
          size: booking.size,
          description: booking.description,
        }),
      }),
    )
  }

  async bookingRejected(booking: Booking): Promise<void> {
    const artist = await this.lookupArtist(booking.artistId)
    if (!artist) return

    await this.safeSend(() =>
      sendEmail({
        to: booking.clientEmail,
        subject: 'Tu cita ha sido rechazada',
        react: BookingRejectedTemplate({
          clientName: booking.clientName,
          bookingId: booking.id.value,
          artistName: artist.name,
          rejectionReason: 'El artista no ha podido aceptar tu solicitud.',
          bodyZone: booking.bodyZone,
          size: booking.size,
          description: booking.description,
        }),
      }),
    )
  }

  async newMessage(booking: Booking, message: BookingMessage): Promise<void> {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.warn('RESEND_API_KEY not configured, skipping message notification')
      return
    }

    const artist = await this.lookupArtist(booking.artistId)
    if (!artist) return

    const fromArtist = message.sender === MessageSender.ARTIST
    const to = fromArtist ? booking.clientEmail : artist.email
    const subjectActor = fromArtist ? artist.name : booking.clientName

    await this.safeSend(async () => {
      const resend = new Resend(apiKey)
      const { error } = await resend.emails.send({
        from: 'InkApp <onboarding@resend.dev>',
        to,
        subject: `Nuevo mensaje de ${subjectActor}`,
        text: `${subjectActor} te ha enviado un mensaje sobre tu cita:\n\n${message.message}\n\nResponde desde tu cuenta.`,
      })
      if (error) console.error('Failed to send message notification:', error)
      return { data: null, error }
    })
  }

  private async lookupArtist(artistId: string) {
    return this.prisma.artist.findUnique({
      where: { id: artistId },
      select: { id: true, name: true, email: true },
    })
  }

  private async safeSend(fn: () => Promise<unknown>): Promise<void> {
    try {
      await fn()
    } catch (err) {
      console.error('Notification dispatch failed:', err)
    }
  }
}
