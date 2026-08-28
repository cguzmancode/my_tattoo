import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verificar si el artista ya existe
    const artist = await prisma.artist.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    return NextResponse.json({
      exists: !!artist,
    })
  } catch (error) {
    console.error('Error checking artist profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
