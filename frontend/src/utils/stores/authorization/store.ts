import { create } from 'zustand'
import type { AuthorizationStep, AuthorizationStore } from './types'

const initialState = {
  step: 'sign-up' as AuthorizationStep,
}

export const useAuthorizationStore = create<AuthorizationStore>()(set => ({
  ...initialState,

  setStep: step => set({ step }),

  goToSignIn: () => set({ step: 'sign-in' }),

  goToSignUp: () => set({ step: 'sign-up' }),

  goToForgotPassword: () => set({ step: 'forgot-password' }),
}))
