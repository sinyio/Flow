import { z } from 'zod'

export const passwordRequirementChecks = {
  hasUpperLower: (s: string) => /[A-ZА-ЯЁ]/.test(s) && /[a-zа-яё]/.test(s),
  minLength: (s: string) => s.length >= 8,
  hasDigit: (s: string) => /\d/.test(s),
  hasSymbol: (s: string) => /[^A-Za-z0-9А-Яа-яЁё]/.test(s),
} as const

export const signUpSchema = z
  .object({
    email: z.email('Некорректный email'),
    password: z
      .string()
      .min(1, 'Введите пароль')
      .refine(passwordRequirementChecks.hasUpperLower, {
        message: 'Ненадежный пароль',
        path: ['password'],
      })
      .refine(passwordRequirementChecks.minLength, {
        message: 'Ненадежный пароль',
        path: ['password'],
      })
      .refine(passwordRequirementChecks.hasDigit, {
        message: 'Ненадежный пароль',
        path: ['password'],
      })
      .refine(passwordRequirementChecks.hasSymbol, {
        message: 'Ненадежный пароль',
        path: ['password'],
      }),
    repeatPassword: z.string().min(1, 'Повторите пароль'),
    rememberMe: z.boolean(),
  })
  .refine(data => data.password === data.repeatPassword, {
    message: 'Пароли не совпадают',
    path: ['repeatPassword'],
  })

export const signInSchema = z.object({
  email: z.email('Некорректный email'),
  password: z.string().min(1, 'Введите пароль'),
  rememberMe: z.boolean(),
})

export const forgotPasswordSchema = z.object({
  email: z.email('Некорректный email'),
})
