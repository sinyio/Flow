import z from 'zod'

export const heroSearchSchema = z.object({
  routeKey: z.string().min(1, 'Выберите направление'),
  startDate: z.string().optional(),
  minPrice: z.string().optional(),
})

export type THeroSearchValues = z.infer<typeof heroSearchSchema>
