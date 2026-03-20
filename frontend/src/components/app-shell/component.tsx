'use client'

import { usePathname } from 'next/navigation'
import { useMemo, type ReactNode } from 'react'
import { Toaster, ToasterComponent, ToasterProvider } from '@gravity-ui/uikit'

import { Header } from '@components/header'
import { useResponsive } from '@utils/hooks/use-responsive'
import styles from './component.module.css'
import { PageContainer } from '@components/page-container/component'
import { MobileBottomMenu } from '@components/profile'

import { mobileNavMocks } from '@views/profile/mocks'

interface AppShellProps {
  children?: ReactNode
}

export const AppShell = ({ children }: AppShellProps) => {
  const { vw } = useResponsive()
  const pathname = usePathname()

  const pageStyles = useMemo(() => {
    const path = pathname.split('/')[1]

    switch (path) {
      case 'auth':
        return styles.authPage
      case 'profile':
        return styles.profilePage
      default:
        return undefined
    }
  }, [pathname])

  const toaster = new Toaster()

  const isAbsolute = pathname.startsWith('/auth')

  const isMobile = Number(vw) > 700

  return (
    <>
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
      ) : (
        <MobileBottomMenu items={mobileNavMocks} />
      )}

      <PageContainer inner={{ className: pageStyles }}>
        <ToasterProvider toaster={toaster}>
          {children}
          <ToasterComponent />
        </ToasterProvider>
      </PageContainer>
    </>
  )
}
