import { useCallback, useState } from 'react'
import axios from 'axios'
import type { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from '@api/auth'

import { authApi } from '@api/auth'

export interface AuthApiError {
  message: string
  status: number
}

function getAuthError(err: unknown): AuthApiError | null {
  if (!axios.isAxiosError(err) || !err.response?.data) return null
  const message = (err.response.data as { message?: string }).message ?? 'Произошла ошибка'
  const status = err.response.status

  return { message, status }
}

export function useAuthApi() {
  const [registerError, setRegisterError] = useState<AuthApiError | null>(null)
  const [isRegisterLoading, setRegisterLoading] = useState(false)
  const [loginError, setLoginError] = useState<AuthApiError | null>(null)
  const [isLoginLoading, setLoginLoading] = useState(false)
  const [logoutError, setLogoutError] = useState<AuthApiError | null>(null)
  const [isLogoutLoading, setLogoutLoading] = useState(false)
  const [meError, setMeError] = useState<AuthApiError | null>(null)
  const [isMeLoading, setMeLoading] = useState(false)

  const register = {
    execute: useCallback(async (payload: RegisterPayload) => {
      setRegisterError(null)
      setRegisterLoading(true)
      try {
        const data = await authApi.register(payload)

        return { data } as { data: RegisterResponse }
      } catch (err) {
        const error = getAuthError(err)

        setRegisterError(error ?? { message: 'Ошибка при регистрации', status: 0 })

        return { error: error ?? { message: 'Ошибка при регистрации', status: 0 } } as {
          error: AuthApiError
        }
      } finally {
        setRegisterLoading(false)
      }
    }, []),
    error: registerError,
    isLoading: isRegisterLoading,
  }

  const login = {
    execute: useCallback(async (payload: LoginPayload) => {
      setLoginError(null)
      setLoginLoading(true)
      try {
        const data = await authApi.login(payload)

        return { data } as { data: LoginResponse }
      } catch (err) {
        const error = getAuthError(err)

        setLoginError(error ?? { message: 'Ошибка входа', status: 0 })

        return { error: error ?? { message: 'Ошибка входа', status: 0 } } as {
          error: AuthApiError
        }
      } finally {
        setLoginLoading(false)
      }
    }, []),
    error: loginError,
    isLoading: isLoginLoading,
  }

  const logout = {
    execute: useCallback(async () => {
      setLogoutError(null)
      setLogoutLoading(true)
      try {
        const data = await authApi.logout()

        return { data }
      } catch (err) {
        const error = getAuthError(err)

        setLogoutError(error ?? { message: 'Ошибка выхода', status: 0 })

        return { error: error ?? { message: 'Ошибка выхода', status: 0 } } as {
          error: AuthApiError
        }
      } finally {
        setLogoutLoading(false)
      }
    }, []),
    error: logoutError,
    isLoading: isLogoutLoading,
  }

  const me = {
    execute: useCallback(async () => {
      setMeError(null)
      setMeLoading(true)
      try {
        const data = await authApi.me()

        return { data }
      } catch (err) {
        const error = getAuthError(err)

        setMeError(error ?? { message: 'Ошибка проверки авторизации', status: 0 })

        return { error: error ?? { message: 'Ошибка проверки авторизации', status: 0 } } as {
          error: AuthApiError
        }
      } finally {
        setMeLoading(false)
      }
    }, []),
    error: meError,
    isLoading: isMeLoading,
  }

  return {
    register,
    login,
    logout,
    me,
    getAuthError,
  }
}

export type { LoginPayload, RegisterPayload }
