import axios, { isAxiosError } from 'axios'

import { isSessionNotFoundInApiMessage } from '@utils/session-not-found'

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

      const data = error.response?.data as { message?: unknown } | undefined

      if (isSessionNotFoundInApiMessage(data?.message) && typeof window !== 'undefined') {
        const path = window.location.pathname

        if (!path.startsWith('/auth')) {
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
