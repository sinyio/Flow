import { dateTime, dateTimeParse } from '@gravity-ui/date-utils'
import { z } from 'zod'
import { signUpPasswordFieldSchema } from '@views/authorization/steps/sign-up-step/validation-schema'

const trim = (value: string) => value.trim()

/** Пустая строка или непустое значение с ограничением длины (поля можно не заполнять) */
const optionalProfileText = (minMessage: string) =>
  z
    .string()
    .transform(trim)
    .pipe(z.union([z.literal(''), z.string().min(1, minMessage).max(20, 'Максимум 20 символов')]))

const parseOptions = { allowRelative: false } as const

/**
 * Дата рождения: парсинг и правила как у @gravity-ui/date-components (dateTimeParse),
 * без ручного regex к ISO — допустимы те же строки, что понимает календарь.
 */
const dateOfBirthOrEmpty = z
  .string()
  .transform(trim)
  .superRefine((val, ctx) => {
    if (val === '') {
      return
    }

    const parsed = dateTimeParse(val, parseOptions)

    if (!parsed?.isValid()) {
      ctx.addIssue({ code: 'custom', message: 'Неверная дата' })

      return
    }

    if (parsed.year() < 1900) {
      ctx.addIssue({ code: 'custom', message: 'Неверная дата' })

      return
    }

    const today = dateTime({ input: new Date() }).startOf('day')

    if (parsed.startOf('day').isAfter(today)) {
      ctx.addIssue({ code: 'custom', message: 'Дата не может быть в будущем' })
    }
  })

const optionalEmail = z
  .string()
  .transform(trim)
  .pipe(z.union([z.literal(''), z.email('Некорректный email')]))

const optionalPassword = z.union([z.literal(''), signUpPasswordFieldSchema])

export const settingsSchema = z.object({
  firstName: optionalProfileText('Укажите имя'),
  lastName: optionalProfileText('Укажите фамилию'),
  sex: z.union([z.literal(''), z.enum(['male', 'female'])]),
  dateOfBirth: dateOfBirthOrEmpty,
  email: optionalEmail,
  currentPassword: z.string(),
  password: optionalPassword,
}).refine(
  data =>
    (data.currentPassword === '' && data.password === '') ||
    (data.currentPassword.length > 0 && data.password.length > 0),
  {
    path: ['password'],
    message: 'Чтобы сменить пароль, заполните оба поля',
  }
)
