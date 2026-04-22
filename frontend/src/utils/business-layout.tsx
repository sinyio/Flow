'use client'

import { ThemeProvider } from '@gravity-ui/uikit'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'

import { useAxiosInstance } from '@api/use-axios-instance'

import { isProtectedPath } from './is-protected-path'
import { ServerData, TServerData } from './server-data-provider'
import { useCurrentUserStore } from './stores/current-user'

interface BusinessLayoutProps {
  children?: ReactNode
  serverData: TServerData
}

export const BusinessLayout = ({ children, serverData }: BusinessLayoutProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const axiosInstance = useAxiosInstance()
  const { fetch: fetchCurrentUser } = useCurrentUserStore()

  useEffect(() => {
    fetchCurrentUser(axiosInstance).then(userId => {
      if (!userId && isProtectedPath(pathname)) {
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
