import { z } from 'zod'

const bookingSchema = z.object({
  artistSlug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid artist slug'),
  clientName: z.string().min(1, 'Name is required'),
  clientEmail: z.string().email('Invalid email format'),
  bodyZone: z.string().min(1, 'Body zone is required'),
  size: z.string().min(1, 'Size is required'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
  preferredDates: z.array(z.string()).min(1, 'At least one preferred date required'),
})

export type BookingInput = z.infer<typeof bookingSchema>

export function validateBooking(data: unknown) {
  const result = bookingSchema.safeParse(data)
  if (result.success) {
    return { success: true as const, data: result.data }
  }
  const errors = result.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message }))
  return { success: false as const, errors }
}
