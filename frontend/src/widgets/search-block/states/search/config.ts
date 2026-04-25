import z from 'zod'

export const heroSearchSchema = z.object({
  routeKey: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  minPrice: z.string().optional(),
})

export type THeroSearchValues = z.infer<typeof heroSearchSchema>
