import axios, { isAxiosError, type AxiosInstance } from 'axios'

import { isProtectedPath } from '@utils/is-protected-path'
import { isSessionNotFoundInApiMessage } from '@utils/session-not-found'

export function resolveApi(path: string, axiosInstance?: AxiosInstance) {
  return {
    client: axiosInstance ?? axios,
    url: axiosInstance ? path : `${process.env.NEXT_PUBLIC_API_HOST}${path}`,
  }
}

export function createApiClient(baseURL: string) {
  const instance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  instance.interceptors.response.use(
    response => response,
    error => {
      if (!isAxiosError(error)) {
        return Promise.reject(error)
      }

      const status = error.response?.status
      const data = error.response?.data as { message?: unknown } | undefined

      // Проверяем: статус 401/403 ИЛИ текст сообщения о потере сессии
      const isUnauthorized =
        status === 401 || status === 403 || isSessionNotFoundInApiMessage(data?.message)

      if (isUnauthorized && typeof window !== 'undefined') {
        const path = window.location.pathname

        // Редиректим только если:
        // 1. Не на странице авторизации
        // 2. И находимся на защищенном роуте
        if (!path.startsWith('/auth') && isProtectedPath(path)) {
          window.location.replace('/auth')

          return new Promise(() => {
            /* редирект в процессе; не пробрасываем в UI */
          })
        }
      }

      return Promise.reject(error)
    }
  )

  return instance
}
