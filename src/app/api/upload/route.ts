import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { safeExtensionFor, validateImageFile } from '@/lib/uploads/image-validation'

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

    const validation = validateImageFile(file)
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    // La extensión se deriva del MIME type validado, nunca del nombre del fichero
    const safeExt = safeExtensionFor(file.type)
    const uniqueFilename = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${safeExt}`

    // NOTE: Using service role key because authenticated users need to upload
    // to their own user folder. The userId validation above ensures they
    // can only write to their own path. Consider using signed URLs for
    // additional security in production.
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

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
