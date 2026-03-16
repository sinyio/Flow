import z from 'zod'

import { forgotPasswordSchema, signInSchema, signUpSchema } from 'src/constants/validation-schema'

export type PasswordRequirementStatus = 'unmet' | 'met' | 'error'

export interface PasswordRequirementItem {
  label: string
  status: PasswordRequirementStatus
}

export type SignUpFormValues = z.infer<typeof signUpSchema>

export type SignInFormValues = z.infer<typeof signInSchema>

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
