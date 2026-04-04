'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { type AxiosInstance } from 'axios'

import { createApiClient } from '@api/client'

const ApiContext = createContext<{ apiHost: string; apiClient: AxiosInstance } | null>(null)

interface ApiProviderProps {
  apiHost: string
  children: ReactNode
}

export const ApiProvider = ({ apiHost, children }: ApiProviderProps) => {
  const value = useMemo(() => {
    const client = createApiClient(apiHost)

    return { apiHost, apiClient: client }
  }, [apiHost])

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>
}

export function useApiContext(): { apiHost: string; apiClient: AxiosInstance } {
  const ctx = useContext(ApiContext)

  if (!ctx) {
    throw new Error('useApiContext must be used within ApiProvider')
  }

  return ctx
}
