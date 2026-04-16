'use server'

import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'

export interface SignedUrlResult {
  success: boolean
  signedUrl?: string
  publicUrl?: string
  error?: string
}

export async function getSignedUploadUrl(
  filename: string,
  contentType: string
): Promise<SignedUrlResult> {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: 'Unauthorized' }
  }

  // Validar tipo de archivo
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(contentType)) {
    return { success: false, error: 'Invalid file type. Only JPG, PNG, WebP allowed' }
  }

  // Validar extensión
  const ext = filename.split('.').pop()?.toLowerCase()
  if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) {
    return { success: false, error: 'Invalid file extension' }
  }

  // Generar nombre único
  const uniqueFilename = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`

  try {
    const supabase = await createClient()

    // Crear signed URL para upload (válido por 60 segundos)
    const { data: signedData, error: signedError } = await supabase.storage
      .from('portfolio')
      .createSignedUploadUrl(uniqueFilename)

    if (signedError) {
      console.error('Error creating signed URL:', signedError)
      return { success: false, error: 'Failed to create upload URL' }
    }

    // Obtener URL pública
    const { data: publicData } = supabase.storage
      .from('portfolio')
      .getPublicUrl(uniqueFilename)

    return {
      success: true,
      signedUrl: signedData.signedUrl,
      publicUrl: publicData.publicUrl,
    }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Internal server error' }
  }
}

export async function deleteImage(imageUrl: string): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: 'Unauthorized' }
  }

  // Extraer path de la URL
  const url = new URL(imageUrl)
  const pathMatch = url.pathname.match(/\/portfolio\/(.*)/)

  if (!pathMatch) {
    return { success: false, error: 'Invalid image URL' }
  }

  const path = pathMatch[1]

  // Verificar que la imagen pertenezca al usuario
  if (!path.startsWith(`${userId}/`)) {
    return { success: false, error: 'Not authorized to delete this image' }
  }

  try {
    const supabase = await createClient()

    const { error } = await supabase.storage
      .from('portfolio')
      .remove([path])

    if (error) {
      console.error('Error deleting image:', error)
      return { success: false, error: 'Failed to delete image' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Internal server error' }
  }
}
