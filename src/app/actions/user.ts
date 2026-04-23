'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export interface ArtistData {
  id: string
  name: string
  email: string
  slug: string
  bio: string | null
  styles: string[]
  isActive: boolean
  instagramUrl: string | null
  portfolioImages: string[]
  depositAmount: number
}

export async function getCurrentArtist(): Promise<ArtistData | null> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return null
    }

    const artist = await prisma.artist.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        name: true,
        email: true,
        slug: true,
        bio: true,
        styles: true,
        isActive: true,
        instagramUrl: true,
        portfolioImages: true,
        depositAmount: true,
      },
    })

    return artist
  } catch (error) {
    console.error('Error fetching current artist:', error)
    return null
  }
}

export async function getArtistName(): Promise<string> {
  const artist = await getCurrentArtist()
  return artist?.name || 'Artista'
}
