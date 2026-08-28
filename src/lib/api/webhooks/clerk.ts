import { prisma } from '@/lib/prisma'
import { generateSlug } from '@/lib/utils'

export interface ClerkEvent {
  type: string
  data: {
    id: string
    email_addresses?: Array<{ email_address: string }>
    first_name?: string
    last_name?: string
  }
}

export interface WebhookResult {
  success: boolean
  artist?: {
    id: string
    clerkId: string
    email: string
    name: string
    slug: string
  }
  error?: string
  statusCode: number
}

export async function handleClerkWebhook(event: ClerkEvent): Promise<WebhookResult> {
  switch (event.type) {
    case 'user.created':
      return handleUserCreated(event)

    case 'user.updated':
      return handleUserUpdated(event)

    default:
      console.log(`Unhandled Clerk event type: ${event.type}`)
      return { success: true, statusCode: 200 }
  }
}

async function handleUserCreated(event: ClerkEvent): Promise<WebhookResult> {
  const { id: clerkId, email_addresses, first_name, last_name } = event.data

  const email = email_addresses?.[0]?.email_address
  if (!email) {
    return {
      success: false,
      error: 'No email provided',
      statusCode: 400,
    }
  }

  // Verificar si ya existe
  const existing = await prisma.artist.findUnique({
    where: { clerkId },
  })

  if (existing) {
    return {
      success: true,
      artist: {
        id: existing.id,
        clerkId: existing.clerkId,
        email: existing.email,
        name: existing.name,
        slug: existing.slug,
      },
      statusCode: 200,
    }
  }

  const name = `${first_name || ''} ${last_name || ''}`.trim() || 'New Artist'
  const baseSlug = generateSlug(name)
  const uniqueSlug = `${baseSlug}-${Date.now()}`

  try {
    const artist = await prisma.artist.create({
      data: {
        clerkId,
        email,
        name,
        slug: uniqueSlug,
      },
    })

    return {
      success: true,
      artist: {
        id: artist.id,
        clerkId: artist.clerkId,
        email: artist.email,
        name: artist.name,
        slug: artist.slug,
      },
      statusCode: 201,
    }
  } catch (error) {
    // Si hay error de unique constraint, el artista ya existe
    const existing = await prisma.artist.findUnique({
      where: { clerkId },
    })

    if (existing) {
      return {
        success: true,
        artist: {
          id: existing.id,
          clerkId: existing.clerkId,
          email: existing.email,
          name: existing.name,
          slug: existing.slug,
        },
        statusCode: 200,
      }
    }

    throw error
  }
}

async function handleUserUpdated(event: ClerkEvent): Promise<WebhookResult> {
  const { id: clerkId, email_addresses, first_name, last_name } = event.data

  const email = email_addresses?.[0]?.email_address
  const name = `${first_name || ''} ${last_name || ''}`.trim()

  const existing = await prisma.artist.findUnique({
    where: { clerkId },
  })

  if (!existing) {
    return {
      success: false,
      error: 'Artist not found',
      statusCode: 404,
    }
  }

  const updateData: { email?: string; name?: string } = {}
  if (email) updateData.email = email
  if (name) updateData.name = name

  const artist = await prisma.artist.update({
    where: { clerkId },
    data: updateData,
  })

  return {
    success: true,
    artist: {
      id: artist.id,
      clerkId: artist.clerkId,
      email: artist.email,
      name: artist.name,
      slug: artist.slug,
    },
    statusCode: 200,
  }
}
