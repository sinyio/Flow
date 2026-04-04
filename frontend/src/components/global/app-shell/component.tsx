'use client'

import { Toaster, ToasterComponent, ToasterProvider } from '@gravity-ui/uikit'
import { usePathname } from 'next/navigation'
import { type ReactNode } from 'react'

import { useResponsive } from '@utils/hooks/use-responsive'
import { useAuthorizationStore } from '@utils/stores/authorization'

import { MobileBottomMenu } from '@components/global/mobile-bottom-menu'
import { Footer } from '@components/organisms/footer'
import { Header } from '@components/organisms/header'

import { mobileNavMocks } from '@views/profile/mocks'

import styles from './component.module.css'

interface AppShellProps {
  children?: ReactNode
}

export const AppShell = ({ children }: AppShellProps) => {
  const { device } = useResponsive()
  const pathname = usePathname()

  const { isAuth } = useAuthorizationStore(store => store)

  const toaster = new Toaster()

  const isAbsolute = pathname.startsWith('/auth')

  return (
    <>
      {device !== 'mobile' ? (
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
        (isAuth ?? <MobileBottomMenu items={mobileNavMocks} />)
      )}

      <ToasterProvider toaster={toaster}>
        {children}
        <ToasterComponent />
      </ToasterProvider>

      {device !== 'mobile' ? <Footer /> : null}
    </>
  )
}
