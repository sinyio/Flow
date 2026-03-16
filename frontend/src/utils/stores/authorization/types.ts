export const AUTHORIZATION_STEPS = ['sign-in', 'sign-up', 'forgot-password'] as const

export type AuthorizationStep = (typeof AUTHORIZATION_STEPS)[number]

export interface AuthorizationState {
  step: AuthorizationStep
}

export interface AuthorizationActions {
  setStep: (step: AuthorizationStep) => void
  goToSignIn: () => void
  goToSignUp: () => void
  goToForgotPassword: () => void
}

export type AuthorizationStore = AuthorizationState & AuthorizationActions
