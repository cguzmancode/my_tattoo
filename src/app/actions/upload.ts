'use server'

import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'
import { createServerClient } from '@supabase/ssr'

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

export async function uploadImage(
  file: FormData
): Promise<UploadResult> {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    const imageFile = file.get('image') as File
    if (!imageFile) {
      return { success: false, error: 'No image provided' }
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(imageFile.type)) {
      return { success: false, error: 'Invalid file type' }
    }

    const ext = imageFile.name.split('.').pop()?.toLowerCase() || 'jpg'
    const uniqueFilename = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`

    const supabase = await createClient()

    const { data, error } = await supabase.storage
      .from('portfolio')
      .upload(uniqueFilename, imageFile, {
        contentType: imageFile.type,
        upsert: false,
      })

    if (error) {
      console.error('Error uploading image:', error)
      return { success: false, error: error.message }
    }

    const { data: publicData } = supabase.storage
      .from('portfolio')
      .getPublicUrl(data.path)

    return {
      success: true,
      url: publicData.publicUrl,
    }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Internal server error' }
  }
}

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

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(contentType)) {
    return { success: false, error: 'Invalid file type. Only JPG, PNG, WebP allowed' }
  }

  const ext = filename.split('.').pop()?.toLowerCase()
  if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) {
    return { success: false, error: 'Invalid file extension' }
  }

  const uniqueFilename = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return []
          },
          setAll() {},
        },
      }
    )

    const { data, error } = await supabase.storage
      .from('portfolio')
      .createSignedUploadUrl(uniqueFilename)

    if (error) {
      console.error('Error creating signed URL:', error)
      return { success: false, error: error.message }
    }

    const { data: publicData } = supabase.storage
      .from('portfolio')
      .getPublicUrl(uniqueFilename)

    return {
      success: true,
      signedUrl: data.signedUrl,
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
