'use client'

import { ThemeProvider } from '@gravity-ui/uikit'
import { redirect, usePathname } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'

import { me } from '@api/auth'

import { isProtectedPath } from './is-protected-path'
import { ServerData, TServerData } from './server-data-provider'

interface BusinessLayoutProps {
  children?: ReactNode
  serverData: TServerData
}

export const BusinessLayout = ({ children, serverData }: BusinessLayoutProps) => {
  const pathname = usePathname()

  useEffect(() => {
    me().catch(() => {
      if (isProtectedPath(pathname)) {
        redirect('/auth')
      }
    })
  }, [])

  return (
    <ServerData.Provider value={serverData}>
      <ThemeProvider scoped theme="light">
        {children}
      </ThemeProvider>
    </ServerData.Provider>
  )
}
