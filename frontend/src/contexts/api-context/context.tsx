'use client'

import { type AxiosInstance } from 'axios'
import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'

import { createApiClient } from '@api/client'

const ApiContext = createContext<{ apiHost: string; apiClient: AxiosInstance } | null>(null)

interface ApiProviderProps {
  apiHost: string
  sessionKey?: string
  children: ReactNode
}

export const ApiProvider = ({ apiHost, sessionKey, children }: ApiProviderProps) => {
  // Определяем нужно ли использовать proxy для cross-origin запросов
  const shouldUseProxy = useMemo(() => {
    if (!sessionKey || typeof window === 'undefined') {
      return false
    }

    const currentHost = window.location.hostname

    try {
      const url = new URL(apiHost)

      return currentHost !== url.hostname
    } catch {
      return false
    }
  }, [apiHost, sessionKey])

  // Устанавливаем session cookie из .env при монтировании
  useEffect(() => {
    if (sessionKey && typeof window !== 'undefined') {
      // Устанавливаем cookie для текущего домена (localhost в dev режиме)
      document.cookie = `session=${sessionKey}; path=/; SameSite=Lax`
      console.log('[ApiProvider] Session key установлен через document.cookie')

      if (shouldUseProxy) {
        console.log('[ApiProvider] Используется proxy /api-proxy/* для cross-origin запросов')
      }
    }
  }, [sessionKey, shouldUseProxy])

  const value = useMemo(() => {
    // Если нужен proxy для cross-origin запросов, используем /api-proxy вместо прямого URL
    const effectiveApiHost = shouldUseProxy ? '/api-proxy' : apiHost
    const client = createApiClient(effectiveApiHost)

    return { apiHost: effectiveApiHost, apiClient: client }
  }, [apiHost, shouldUseProxy])

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>
}

export function useApiContext(): { apiHost: string; apiClient: AxiosInstance } {
  const ctx = useContext(ApiContext)

  if (!ctx) {
    throw new Error('useApiContext must be used within ApiProvider')
  }

  return ctx
}
