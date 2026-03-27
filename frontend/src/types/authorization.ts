import z from 'zod'

import { forgotPasswordSchema } from '@views/authorization/steps/forgot-password-step/validation-schema'
import { signInSchema } from '@views/authorization/steps/sign-in-step/validation-schema'
import { signUpSchema } from '@views/authorization/steps/sign-up-step/validation-schema'

export type SignUpFormValues = z.infer<typeof signUpSchema>

export type SignInFormValues = z.infer<typeof signInSchema>

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
