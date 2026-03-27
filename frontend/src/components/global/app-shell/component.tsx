'use client'

import { usePathname } from 'next/navigation'
import { type ReactNode } from 'react'
import { Toaster, ToasterComponent, ToasterProvider } from '@gravity-ui/uikit'

import { MobileBottomMenu } from '@components/global/mobile-bottom-menu'
import { Header } from '../header'
import { useResponsive } from '@utils/hooks/use-responsive'
import styles from './component.module.css'
import { useAuthorizationStore } from '@utils/stores/authorization'
import { Footer } from '../footer'

import { mobileNavMocks } from '@views/profile/mocks'

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
