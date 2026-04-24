import { BookingStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email/resend'
import { BookingSubmittedTemplate, BookingAcceptedTemplate, BookingRejectedTemplate } from '@/lib/email/templates'

export interface CreateBookingInput {
  artistSlug: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  bodyZone: string
  size: string
  description: string
  preferredDates?: string[]
  referenceImages?: string[]
}

export interface CreateBookingResult {
  success: boolean
  booking?: {
    id: string
    artistId: string
    clientName: string
    clientEmail: string
    bodyZone: string
    size: string
    description: string
    status: string
    createdAt: Date
    updatedAt: Date
  }
  error?: string
  statusCode: number
}

export interface UpdateBookingInput {
  status: BookingStatus
  proposedDate?: Date
}

export interface UpdateBookingResult {
  success: boolean
  booking?: {
    id: string
    artistId: string
    clientName: string
    clientEmail: string
    bodyZone: string
    size: string
    description: string
    status: string
    proposedDate: Date | null
    depositPaid: boolean
    createdAt: Date
    updatedAt: Date
  }
  error?: string
  statusCode: number
}

export async function createBooking(
  input: CreateBookingInput
): Promise<CreateBookingResult> {
  // Validar datos mínimos
  if (!input.artistSlug || !input.clientName || !input.clientEmail) {
    return {
      success: false,
      error: 'Missing required fields',
      statusCode: 400,
    }
  }

  // Buscar artista por slug
  const artist = await prisma.artist.findUnique({
    where: { slug: input.artistSlug },
  })

  if (!artist) {
    return {
      success: false,
      error: 'Artist not found',
      statusCode: 404,
    }
  }

  // Crear booking
  const booking = await prisma.booking.create({
    data: {
      artistId: artist.id,
      clientName: input.clientName,
      clientEmail: input.clientEmail,
      clientPhone: input.clientPhone,
      bodyZone: input.bodyZone,
      size: input.size,
      description: input.description,
      preferredDates: input.preferredDates || [],
      referenceImages: input.referenceImages || [],
    },
  })

  // Enviar email de confirmación al cliente
  await sendEmail({
    to: input.clientEmail,
    subject: 'Tu solicitud de cita ha sido recibida',
    react: BookingSubmittedTemplate({
      clientName: input.clientName,
      bookingId: booking.id,
      artistName: artist.name,
      bodyZone: input.bodyZone,
      size: input.size,
      description: input.description,
    }),
  })

  return {
    success: true,
    booking: {
      id: booking.id,
      artistId: booking.artistId,
      clientName: booking.clientName,
      clientEmail: booking.clientEmail,
      bodyZone: booking.bodyZone,
      size: booking.size,
      description: booking.description,
      status: booking.status,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    },
    statusCode: 201,
  }
}

export async function updateBookingStatus(
  bookingId: string,
  input: UpdateBookingInput
): Promise<UpdateBookingResult> {
  // Verificar que el booking existe
  const existing = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { artist: true },
  })

  if (!existing) {
    return {
      success: false,
      error: 'Booking not found',
      statusCode: 404,
    }
  }

  // Actualizar booking
  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: input.status,
      proposedDate: input.proposedDate,
    },
  })

  // Enviar email según el nuevo estado
  if (input.status === 'ACCEPTED') {
    await sendEmail({
      to: existing.clientEmail,
      subject: '¡Tu cita ha sido aceptada!',
      react: BookingAcceptedTemplate({
        clientName: existing.clientName,
        bookingId: booking.id,
        artistName: existing.artist.name,
        proposedDate: input.proposedDate || booking.proposedDate || new Date(),
        priceEstimate: booking.priceEstimate || undefined,
        bodyZone: existing.bodyZone,
        size: existing.size,
        description: existing.description,
      }),
    })
  } else if (input.status === 'REJECTED') {
    const rejectionReason = input.proposedDate ? String(input.proposedDate) : undefined
    await sendEmail({
      to: existing.clientEmail,
      subject: 'Tu cita ha sido rechazada',
      react: BookingRejectedTemplate({
        clientName: existing.clientName,
        bookingId: booking.id,
        artistName: existing.artist.name,
        rejectionReason: rejectionReason,
        bodyZone: existing.bodyZone,
        size: existing.size,
        description: existing.description,
      }),
    })
  }

  return {
    success: true,
    booking: {
      id: booking.id,
      artistId: booking.artistId,
      clientName: booking.clientName,
      clientEmail: booking.clientEmail,
      bodyZone: booking.bodyZone,
      size: booking.size,
      description: booking.description,
      status: booking.status,
      proposedDate: booking.proposedDate,
      depositPaid: booking.depositPaid,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    },
    statusCode: 200,
  }
}
