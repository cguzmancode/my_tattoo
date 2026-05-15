import { NextRequest, NextResponse } from 'next/server'
import { createElement } from 'react'
import { render as renderEmail } from '@react-email/components'
import { createBooking } from '@/lib/api/bookings'
import { createAdminClient } from '@/lib/supabase/admin'
import { rateLimitMiddleware } from '@/lib/rate-limit'
import { validateBooking } from '@/lib/schemas/booking'
import { DEMO_ARTIST } from '@/lib/mocks'
import { BookingSubmittedTemplate } from '@/lib/email/templates'

export async function POST(request: NextRequest) {
  // Aplicar rate limiting: 5 requests por minuto
  const rateLimitResult = rateLimitMiddleware(request, { maxRequests: 5, windowMs: 60000 })
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

    // Validar con Zod schema
    const validation = validateBooking({
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

    // Extraer imágenes
    const images: File[] = []
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('image_') && value instanceof File) {
        images.push(value)
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
        const filename = `bookings/${artistSlug}/${timestamp}-${random}.jpg`

        // Subir archivo
        const { error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload(filename, image, {
            contentType: 'image/jpeg',
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
