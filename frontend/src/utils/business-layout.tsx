'use client'

import { ThemeProvider } from '@gravity-ui/uikit'
import { isAxiosError } from 'axios'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'

import { me } from '@api/auth'
import { useAxiosInstance } from '@api/use-axios-instance'

import { isSessionNotFoundInApiMessage } from '@utils/session-not-found'

import { isProtectedPath } from './is-protected-path'
import { ServerData, TServerData } from './server-data-provider'

interface BusinessLayoutProps {
  children?: ReactNode
  serverData: TServerData
}

export const BusinessLayout = ({ children, serverData }: BusinessLayoutProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const axiosInstance = useAxiosInstance()

  useEffect(() => {
    me(axiosInstance).catch((error: unknown) => {
      if (!isProtectedPath(pathname)) {
        return
      }
      if (!isAxiosError(error)) {
        return
      }
      const status = error.response?.status
      const data = error.response?.data as { message?: unknown } | undefined

      const shouldSendToAuth =
        status === 401 ||
        status === 403 ||
        isSessionNotFoundInApiMessage(data?.message)

      if (shouldSendToAuth) {
        router.replace('/auth')
      }
    })
  }, [axiosInstance, pathname, router])

  return (
    <ServerData.Provider value={serverData}>
      <ThemeProvider scoped theme="light">
        {children}
      </ThemeProvider>
    </ServerData.Provider>
  )
}
