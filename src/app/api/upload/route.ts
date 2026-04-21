import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const uniqueFilename = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`

    // Usar cliente admin con service role key si está disponible
    let supabase
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      supabase = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
    } else {
      // Fallback al cliente normal
      supabase = await createClient()
    }

    const { data, error } = await supabase.storage
      .from('portfolio')
      .upload(uniqueFilename, file, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      console.error('Error uploading image:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: publicData } = supabase.storage
      .from('portfolio')
      .getPublicUrl(data.path)

    return NextResponse.json({ 
      success: true, 
      url: publicData.publicUrl 
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
