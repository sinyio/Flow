import type { IAuthorizationState, TAuthorizationStep, TAuthorizationStore } from './types'
import { AxiosError, isAxiosError } from 'axios'
import { create } from 'zustand'

import {
  me,
  register as apiRegister,
  login as apiLogin,
  logout as apiLogout,
  emailConfirmation,
} from '@api/auth'
import { IApiError } from '@api/types'

const initialState: IAuthorizationState = {
  authorizationStep: 'sign-in' as TAuthorizationStep,
  isAuth: false,
  isLoading: {
    checkIsAuth: false,
    register: false,
    login: false,
    logout: false,
    confirmEmail: false,
  },
}

function handleAuthError(error: unknown): never {
  if (isAxiosError(error)) {
    const axiosError: AxiosError<IApiError> = error

    if (axiosError.response?.data.error) {
      throw axiosError.response?.data
    }
  }

  throw {
    message: 'Неизвестная ошибка',
    statusCode: 400,
  }
}

export const useAuthorizationStore = create<TAuthorizationStore>()(set => ({
  ...initialState,

  setAuthorizationStep: authorizationStep => set({ authorizationStep }),

  checkIsAuth: axiosInstance => {
    set(state => ({ isLoading: { ...state.isLoading, checkIsAuth: true } }))

    return me(axiosInstance)
      .then(response => {
        if ('status' in response.data) {
          set({ isAuth: true })

          return true
        } else {
          set({ isAuth: false })

          return false
        }
      })
      .catch(error => {
        set({ isAuth: false })
        handleAuthError(error)
      })
      .finally(() => set(state => ({ isLoading: { ...state.isLoading, checkIsAuth: false } })))
  },

  register: (data, axiosInstance) => {
    set(state => ({ isLoading: { ...state.isLoading, register: true } }))

    return apiRegister(data, axiosInstance)
      .then(response => {
        set({ authorizationStep: 'check-email' })

        return response.data
      })
      .catch(handleAuthError)
      .finally(() => set(state => ({ isLoading: { ...state.isLoading, register: false } })))
  },

  login: (data, axiosInstance) => {
    set(state => ({ isLoading: { ...state.isLoading, login: true } }))

    return apiLogin(data, axiosInstance)
      .then(response => response.data)
      .catch(handleAuthError)
      .finally(() => set(state => ({ isLoading: { ...state.isLoading, login: false } })))
  },

  logout: axiosInstance => {
    set(state => ({ isLoading: { ...state.isLoading, logout: true } }))

    return apiLogout(axiosInstance)
      .then(response => response.data)
      .catch(handleAuthError)
      .finally(() =>
        set(state => ({ isAuth: false, isLoading: { ...state.isLoading, logout: false } }))
      )
  },

  confirmEmail: (data, axiosInstance) => {
    set(state => ({ isLoading: { ...state.isLoading, confirmEmail: true } }))

    return emailConfirmation(data, axiosInstance)
      .then(response => response.data)
      .catch(handleAuthError)
      .finally(() => set(state => ({ isLoading: { ...state.isLoading, confirmEmail: false } })))
  },
}))
