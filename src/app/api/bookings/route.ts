import { NextRequest, NextResponse } from 'next/server'
import { createBooking } from '@/lib/api/bookings'
import { createAdminClient } from '@/lib/supabase/admin'
import { rateLimitMiddleware } from '@/lib/rate-limit'

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
