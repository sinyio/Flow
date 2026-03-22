'use client'

import { ThemeProvider } from '@gravity-ui/uikit'
import { useEffect, type ReactNode } from 'react'
import { redirect, usePathname } from 'next/navigation'

import { me } from '@api/auth'
import { isProtectedPath } from './is-protected-path'

interface BusinessLayoutProps {
  children?: ReactNode
}

export const BusinessLayout = ({ children }: BusinessLayoutProps) => {
  const pathname = usePathname()

  useEffect(() => {
    me().catch(() => {
      if (isProtectedPath(pathname)) {
        redirect('/auth')
      }
    })
  }, [])

  return (
    <ThemeProvider scoped theme="light">
      {children}
    </ThemeProvider>
  )
}
