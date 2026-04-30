import { z } from 'zod'

const numberString = (label: string) =>
  z
    .string()
    .trim()
    .min(1, 'Введите значение')
    .refine(v => !Number.isNaN(Number(v)), `${label} должно быть числом`)
    .refine(v => Number(v) > 0, `${label} должно быть больше 0`)

export const createAdSchema = z.object({
  routeKey: z.string().trim().min(1, 'Выберите направление'),
  startDate: z.string().trim().min(1, 'Выберите дату начала'),
  endDate: z.string().trim().min(1, 'Выберите дату окончания'),
  title: z.string().trim().min(1, 'Введите название'),
  role: z.enum(['sender', 'recipient']),
  isDocument: z.boolean(),
  isFragile: z.boolean(),
  packaging: z.string().trim().min(1, 'Выберите упаковку'),
  weight: numberString('Вес'),
  length: numberString('Длина'),
  width: numberString('Ширина'),
  height: numberString('Высота'),
  price: numberString('Вознаграждение'),
  description: z.string().trim().max(1000, 'Не более 1000 символов').optional().default(''),
  image: z
    .instanceof(File, { message: 'Добавьте фото' })
    .nullable()
    .refine(v => v !== null, { message: 'Добавьте фото' })
    .refine(v => v === null || v.size <= 10 * 1024 * 1024, { message: 'Файл не должен превышать 10 МБ' }),
})
