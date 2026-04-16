'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { generateSlug } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

export interface UpdateProfileInput {
  name?: string
  bio?: string
  styles?: string[]
  depositAmount?: number
  instagramUrl?: string
  slug?: string
}

export async function updateProfile(input: UpdateProfileInput) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Unauthorized')
  }

  const artist = await prisma.artist.findUnique({
    where: { clerkId: userId },
  })

  if (!artist) {
    throw new Error('Artist not found')
  }

  // Validar slug único si se está cambiando
  if (input.slug && input.slug !== artist.slug) {
    const existing = await prisma.artist.findUnique({
      where: { slug: input.slug },
    })

    if (existing) {
      throw new Error('Slug already taken')
    }

    // Validar formato de slug
    if (!/^[a-z0-9-]+$/.test(input.slug)) {
      throw new Error('Invalid slug format')
    }
  }

  // Validar depositAmount
  if (input.depositAmount !== undefined && input.depositAmount < 0) {
    throw new Error('Deposit amount must be positive')
  }

  const updated = await prisma.artist.update({
    where: { clerkId: userId },
    data: {
      ...(input.name && { name: input.name }),
      ...(input.bio !== undefined && { bio: input.bio }),
      ...(input.styles && { styles: input.styles }),
      ...(input.depositAmount !== undefined && { depositAmount: input.depositAmount }),
      ...(input.instagramUrl !== undefined && { instagramUrl: input.instagramUrl }),
      ...(input.slug && { slug: input.slug }),
    },
  })

  revalidatePath('/dashboard/settings')
  revalidatePath(`/t/${updated.slug}`)

  return updated
}

export async function getProfile() {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Unauthorized')
  }

  const artist = await prisma.artist.findUnique({
    where: { clerkId: userId },
  })

  if (!artist) {
    throw new Error('Artist not found')
  }

  return artist
}

export async function getArtistBySlug(slug: string) {
  const artist = await prisma.artist.findUnique({
    where: { slug, isActive: true },
    select: {
      id: true,
      name: true,
      slug: true,
      bio: true,
      styles: true,
      depositAmount: true,
      instagramUrl: true,
      portfolioImages: true,
      isActive: true,
    },
  })

  if (!artist) {
    throw new Error('Artist not found')
  }

  return artist
}

export async function generateUniqueSlug(name: string) {
  const baseSlug = generateSlug(name)

  // Verificar si está disponible
  const existing = await prisma.artist.findUnique({
    where: { slug: baseSlug },
  })

  if (!existing) {
    return baseSlug
  }

  // Generar slug único con timestamp
  return `${baseSlug}-${Date.now()}`
}

export async function updatePortfolioImages(imageUrls: string[]) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Unauthorized')
  }

  // Validar límite de imágenes
  if (imageUrls.length > 10) {
    throw new Error('Maximum 10 portfolio images allowed')
  }

  const updated = await prisma.artist.update({
    where: { clerkId: userId },
    data: { portfolioImages: imageUrls },
  })

  revalidatePath('/dashboard/settings/profile')
  revalidatePath(`/t/${updated.slug}`)

  return updated
}
