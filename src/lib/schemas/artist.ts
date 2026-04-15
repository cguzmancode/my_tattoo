import { z } from 'zod'

const artistSchema = z.object({
  clerkId: z.string(),
  email: z.string().email(),
  name: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  depositAmount: z.number().min(0),
})

export function validateArtist(data: unknown) {
  const result = artistSchema.safeParse(data)
  return { success: result.success }
}
