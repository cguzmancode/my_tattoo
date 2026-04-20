import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
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

    // Buscar el artista existente (creado por el webhook de Clerk)
    const existingArtist = await prisma.artist.findUnique({
      where: { clerkId: userId },
    })

    if (!existingArtist) {
      return NextResponse.json(
        { error: 'Artist not found. Please sign up first.' },
        { status: 404 }
      )
    }

    // Generar slug a partir del nombre
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    // Verificar si el slug ya existe
    let slug = baseSlug
    let suffix = 1
    while (await prisma.artist.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix}`
      suffix++
    }

    // Actualizar el perfil del artista
    const updatedArtist = await prisma.artist.update({
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

    return NextResponse.json({
      success: true,
      artist: updatedArtist,
    })
  } catch (error) {
    console.error('Error in onboarding:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
