'use client'

import { Toaster, ToasterComponent, ToasterProvider } from '@gravity-ui/uikit'
import { usePathname } from 'next/navigation'
import { type ReactNode, useRef } from 'react'

import { useResponsive } from '@utils/hooks/use-responsive'

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

  const toasterRef = useRef<Toaster | null>(null)

  if (!toasterRef.current) {
    toasterRef.current = new Toaster()
  }

  const toaster = toasterRef.current

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
      ) : !pathname.startsWith('/auth') ? (
        <MobileBottomMenu items={mobileNavMocks} />
      ) : null}

      <ToasterProvider toaster={toaster}>
        {children}
        <ToasterComponent />
      </ToasterProvider>

      {device !== 'mobile' && !pathname.startsWith('/auth') ? <Footer /> : null}
    </>
  )
}
