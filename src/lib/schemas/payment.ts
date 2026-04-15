import { z } from 'zod'

const paymentSchema = z.object({
  amount: z.number().min(1),
  currency: z.string(),
})

export function validatePayment(data: unknown) {
  const result = paymentSchema.safeParse(data)
  return { success: result.success }
}
