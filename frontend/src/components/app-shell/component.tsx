'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { Toaster, ToasterComponent, ToasterProvider } from '@gravity-ui/uikit'

import { Header } from '@components/header'
import { useResponsive } from '@utils/hooks/use-responsive'
import styles from './component.module.scss'
import { PageContainer } from '@components/page-container/component'

interface AppShellProps {
  children?: ReactNode
}

export const AppShell = ({ children }: AppShellProps) => {
  const device = useResponsive()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  const toaster = new Toaster()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Until hydration is complete, avoid DOM branch switching driven by media queries.
  const effectiveDevice = mounted ? device : 'desktop'

  const hasHeader = effectiveDevice !== 'mobile'
  const isAuthorizationPage = pathname.startsWith('/auth')

  return (
    <PageContainer inner={{ className: styles.inner }}>
      {hasHeader ? (
        isAuthorizationPage ? (
          <div className={styles.stickyHeader}>
            <Header />
          </div>
        ) : (
          <>
            <div className={styles.fixedHeader}>
              <Header />
            </div>
            <div aria-hidden="true" className={styles.fixedHeaderSpacer} />
          </>
        )
      ) : null}
      <ToasterProvider toaster={toaster}>
        {children}
        <ToasterComponent />
      </ToasterProvider>
    </PageContainer>
  )
}
