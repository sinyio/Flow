'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { Toaster, ToasterComponent, ToasterProvider } from '@gravity-ui/uikit'

import { Header } from '@components/header'
import { useResponsive } from '@utils/hooks/use-responsive'
import styles from './component.module.css'
import { PageContainer } from '@components/page-container/component'

interface AppShellProps {
  children?: ReactNode
}

export const AppShell = ({ children }: AppShellProps) => {
  const { vw } = useResponsive()
  const pathname = usePathname()

  const toaster = new Toaster()

  const isAbsolute = pathname.startsWith('/auth')

  const isMobile = Number(vw) > 700

  return (
    <PageContainer inner={{ className: styles.inner }}>
      {isMobile ? (
        isAbsolute ? (
          <div className={styles.absoluteHeader}>
            <Header />
          </div>
        ) : (
          <div className={styles.fixedHeader}>
            <Header />
          </div>
        )
      ) : null}
      <ToasterProvider toaster={toaster}>
        {children}
        <ToasterComponent />
      </ToasterProvider>
    </PageContainer>
  )
}
