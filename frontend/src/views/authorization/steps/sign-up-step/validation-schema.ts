import type { IPasswordRequirement } from '@components/templates/password-requirements'
import { z } from 'zod'

export const passwordRequirementChecks = {
  hasUpperLower: (s: string) => /[A-ZА-ЯЁ]/.test(s) && /[a-zа-яё]/.test(s),
  minLength: (s: string) => s.length >= 8,
  hasDigit: (s: string) => /\d/.test(s),
  hasSymbol: (s: string) => /[^A-Za-z0-9А-Яа-яЁё]/.test(s),
} as const

export const signUpPasswordFieldSchema = z
  .string()
  .min(1, 'Введите пароль')
  .refine(passwordRequirementChecks.hasUpperLower, { message: 'Ненадежный пароль' })
  .refine(passwordRequirementChecks.minLength, { message: 'Ненадежный пароль' })
  .refine(passwordRequirementChecks.hasDigit, { message: 'Ненадежный пароль' })
  .refine(passwordRequirementChecks.hasSymbol, { message: 'Ненадежный пароль' })

export const signUpSchema = z
  .object({
    email: z.email('Некорректный email'),
    password: signUpPasswordFieldSchema,
    repeatPassword: z.string().min(1, 'Повторите пароль'),
    rememberMe: z.boolean(),
  })
  .refine(data => data.password === data.repeatPassword, {
    message: 'Пароли не совпадают',
    path: ['repeatPassword'],
  })

function statusFor(met: boolean, hasSchemaError: boolean): IPasswordRequirement['status'] {
  if (hasSchemaError && !met) return 'error'

  return met ? 'met' : 'unmet'
}

/** Статусы строк подсказок — из той же схемы, что и resolver, без дублирования логики из формы */
export function buildPasswordRequirementItems(password: string): IPasswordRequirement[] {
  const shouldValidate = password.length > 0
  const hasSchemaError = shouldValidate && !signUpPasswordFieldSchema.safeParse(password).success

  return [
    {
      label: 'Заглавные и строчные буквы',
      status: statusFor(passwordRequirementChecks.hasUpperLower(password), hasSchemaError),
    },
    {
      label: 'Минимум 8 знаков',
      status: statusFor(passwordRequirementChecks.minLength(password), hasSchemaError),
    },
    {
      label: 'Минимум одну цифру',
      status: statusFor(passwordRequirementChecks.hasDigit(password), hasSchemaError),
    },
    {
      label: 'Минимум один символ',
      status: statusFor(passwordRequirementChecks.hasSymbol(password), hasSchemaError),
    },
  ]
}
