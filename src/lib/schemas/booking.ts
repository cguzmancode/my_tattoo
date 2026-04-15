import { z } from 'zod'

const bookingSchema = z.object({
  clientName: z.string().min(1),
  clientEmail: z.string().email(),
  bodyZone: z.string().min(1),
  size: z.string().min(1),
  description: z.string().min(1),
  preferredDates: z.array(z.string()),
})

export function validateBooking(data: unknown) {
  const result = bookingSchema.safeParse(data)
  return { success: result.success }
}
