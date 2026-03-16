'use client'

import { ThemeProvider } from '@gravity-ui/uikit'
import type { ReactNode } from 'react'

interface BusinessLayoutProps {
  children?: ReactNode
}

export const BusinessLayout = ({ children }: BusinessLayoutProps) => (
  <ThemeProvider scoped theme="light">
    {children}
  </ThemeProvider>
)
