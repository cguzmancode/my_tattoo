import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, bio, styles, depositAmount, instagramUrl } = body

    // Validar campos requeridos
    if (!name || !bio || !styles?.length || !depositAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Obtener datos del usuario de Clerk
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found in Clerk' },
        { status: 404 }
      )
    }

    const email = user.emailAddresses?.[0]?.emailAddress
    const firstName = user.firstName || ''
    const lastName = user.lastName || ''
    const clerkName = `${firstName} ${lastName}`.trim() || name

    // Buscar si el artista ya existe
    let artist = await prisma.artist.findUnique({
      where: { clerkId: userId },
    })

    // Generar slug único
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    let slug = baseSlug
    let suffix = 1
    while (await prisma.artist.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix}`
      suffix++
    }

    if (artist) {
      // Actualizar artista existente
      artist = await prisma.artist.update({
        where: { clerkId: userId },
        data: {
          name,
          bio,
          styles,
          depositAmount: parseInt(depositAmount) * 100, // Convertir a centavos
          instagramUrl: instagramUrl || null,
          slug,
          isActive: true,
        },
      })
    } else {
      // Crear nuevo artista automáticamente
      artist = await prisma.artist.create({
        data: {
          clerkId: userId,
          email: email || `${userId}@placeholder.com`,
          name,
          bio,
          styles,
          depositAmount: parseInt(depositAmount) * 100,
          instagramUrl: instagramUrl || null,
          slug,
          isActive: true,
        },
      })
    }

    return NextResponse.json({
      success: true,
      artist: {
        id: artist.id,
        clerkId: artist.clerkId,
        name: artist.name,
        slug: artist.slug,
        email: artist.email,
      },
    })
  } catch (error) {
    console.error('Error in onboarding:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
