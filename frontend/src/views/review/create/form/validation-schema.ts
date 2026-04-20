import { z } from 'zod'

export const createReviewSchema = z.object({
  rating: z.number().min(1, 'Поставьте оценку').max(5, 'Максимальная оценка 5'),
  text: z.string().default(''),
  isAnonymous: z.boolean().default(false),
  files: z.array(z.instanceof(File)).default([]),
})

export type CreateReviewInput = z.input<typeof createReviewSchema>
export type CreateReviewOutput = z.output<typeof createReviewSchema>
