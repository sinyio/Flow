'use client'

import { Link, Text } from '@gravity-ui/uikit'
import { ReactNode } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

import { useCurrentUserStore } from '@utils/stores/current-user/store'

import { LiquidGlassBlock } from '@components/global/liquid-glass-block'

import styles from './component.module.css'

export type TMobileNavItem = {
  icon: ReactNode
  label: string
  value: string
  activeMatcher?: (pathname: string, userId: string | null, searchParams: URLSearchParams) => boolean
}
export interface IMobileNavProps {
  items: TMobileNavItem[]
}

export const MobileBottomMenu = ({ items }: IMobileNavProps) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const userId = useCurrentUserStore((s) => s.userId)

  return (
    <nav aria-label="Нижнее меню">
      <LiquidGlassBlock className={styles.container}>
        {items.map((item, index) => {
          const isActive = item.activeMatcher ? item.activeMatcher(pathname, userId, searchParams) : pathname === '/' + item.value
          return (
            <Link
              key={'mobileNav-' + item.value + index}
              className={`${styles.item} ${isActive ? styles.active : ''}`}
              href={'/' + item.value}
            >
              {item.icon}
              <Text variant="body-1" color="secondary">{item.label}</Text>
            </Link>
          )
        })}
      </LiquidGlassBlock>
    </nav>
  )
}
