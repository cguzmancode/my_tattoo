import { NextRequest, NextResponse } from 'next/server'
import { createElement } from 'react'
import { render as renderEmail } from '@react-email/components'
import { prisma } from '@/lib/prisma'
import { createBooking } from '@/lib/api/bookings'
import { createAdminClient } from '@/lib/supabase/admin'
import { rateLimitMiddleware } from '@/lib/rate-limit'
import { validateBooking } from '@/lib/schemas/booking'
import {
  MAX_FILES_PER_BOOKING,
  safeExtensionFor,
  validateImageFile,
} from '@/lib/uploads/image-validation'
import { DEMO_ARTIST } from '@/lib/mocks'
import { BookingSubmittedTemplate } from '@/lib/email/templates'

export async function POST(request: NextRequest) {
  // Aplicar rate limiting: 5 requests por minuto
  const rateLimitResult = await rateLimitMiddleware(request, { maxRequests: 5, windowMs: 60000 })
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { success: false, error: rateLimitResult.error },
      { status: rateLimitResult.statusCode }
    )
  }

  try {
    const formData = await request.formData()

    // Extraer campos del formulario
    const artistSlug = formData.get('artistSlug') as string
    const clientName = formData.get('clientName') as string
    const clientEmail = formData.get('clientEmail') as string
    const description = formData.get('description') as string
    const preferredDate = formData.get('preferredDate') as string
    const bodyZone = formData.get('bodyZone') as string
    const size = formData.get('size') as string

    // Validar campos requeridos
    if (!artistSlug || !clientName || !clientEmail || !description || !preferredDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validar con Zod schema (incluye el formato del slug, que luego se usa
    // como segmento de ruta en Storage)
    const validation = validateBooking({
      artistSlug,
      clientName,
      clientEmail,
      bodyZone,
      size,
      description,
      preferredDates: [preferredDate],
    })

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid data', details: validation.errors },
        { status: 400 }
      )
    }

    // Demo path: el slug demo no existe en la DB, así que simulamos el envío
    // para no escribir nada en Storage ni en bookings, y devolvemos el HTML
    // del email que se habría mandado para que el recruiter lo vea inline.
    if (artistSlug === DEMO_ARTIST.slug) {
      const bookingId = `demo-${Date.now()}`
      const emailHtml = await renderEmail(
        createElement(BookingSubmittedTemplate, {
          clientName,
          bookingId,
          artistName: DEMO_ARTIST.name,
          bodyZone,
          size,
          description,
        })
      )
      return NextResponse.json({
        success: true,
        demo: true,
        booking: { id: bookingId, status: 'PENDING' },
        emailTo: clientEmail,
        emailHtml,
      })
    }

    // Resolver el artista ANTES de tocar Storage: un slug inexistente no debe
    // dejar ningún fichero escrito.
    const artist = await prisma.artist.findUnique({
      where: { slug: artistSlug },
      select: { id: true },
    })
    if (!artist) {
      return NextResponse.json(
        { success: false, error: 'Artist not found' },
        { status: 404 }
      )
    }

    // Extraer imágenes
    const images: File[] = []
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('image_') && value instanceof File) {
        images.push(value)
      }
    }

    // Validar TODAS las imágenes antes de subir ninguna
    if (images.length > MAX_FILES_PER_BOOKING) {
      return NextResponse.json(
        { success: false, error: `Too many files (max ${MAX_FILES_PER_BOOKING})` },
        { status: 400 }
      )
    }
    for (const image of images) {
      const result = validateImageFile(image)
      if (!result.ok) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 400 }
        )
      }
    }

    // Subir imágenes a Supabase Storage usando admin client (no requiere auth de usuario)
    const imageUrls: string[] = []
    if (images.length > 0) {
      const supabase = createAdminClient()

      for (const image of images) {
        // Generar nombre único
        const timestamp = Date.now()
        const random = Math.random().toString(36).substring(2, 9)
        const ext = safeExtensionFor(image.type)
        const filename = `bookings/${artistSlug}/${timestamp}-${random}.${ext}`

        // Subir archivo
        const { error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload(filename, image, {
            contentType: image.type,
            cacheControl: '3600',
          })

        if (uploadError) {
          console.error('Error uploading image:', uploadError)
          continue
        }

        // Obtener URL pública
        const { data: publicUrl } = supabase.storage
          .from('portfolio')
          .getPublicUrl(filename)

        imageUrls.push(publicUrl.publicUrl)
      }
    }

    const result = await createBooking({
      artistSlug,
      clientName,
      clientEmail,
      bodyZone,
      size,
      description,
      preferredDates: [preferredDate],
      referenceImages: imageUrls,
    })

    return NextResponse.json(
      result.success ? { success: true, booking: result.booking } : { success: false, error: result.error },
      { status: result.statusCode }
    )
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
