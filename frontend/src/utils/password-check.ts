import { PasswordRequirementStatus } from '@components/password-requirements/component'
import { passwordRequirementChecks } from 'src/constants/validation-schema'
import { PasswordRequirementItem } from 'src/types/authorization'

export function getPasswordRequirementItems(
  password: string,
  hasError: boolean
): PasswordRequirementItem[] {
  return [
    {
      label: 'Заглавные и строчные буквы',
      status: statusFor(passwordRequirementChecks.hasUpperLower(password), hasError),
    },
    {
      label: 'Минимум 8 знаков',
      status: statusFor(passwordRequirementChecks.minLength(password), hasError),
    },
    {
      label: 'Минимум одну цифру',
      status: statusFor(passwordRequirementChecks.hasDigit(password), hasError),
    },
    {
      label: 'Минимум один символ',
      status: statusFor(passwordRequirementChecks.hasSymbol(password), hasError),
    },
  ]
}

function statusFor(met: boolean, hasError: boolean): PasswordRequirementStatus {
  if (hasError && !met) return 'error'

  return met ? 'met' : 'unmet'
}
