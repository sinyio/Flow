import Link from 'next/link'
import { ReactNode } from 'react'

import styles from './component.module.css'
import { Typography } from '@components/typography/component'
import { LiquidGlassBlock } from '@components/liquid-glass-block'

export type TMobileNavItem = {
  icon: ReactNode
  label: string
  value: string
}
export interface IMobileNavProps {
  items: TMobileNavItem[]
}

export const MobileBottomMenu = ({ items }: IMobileNavProps) => (
  <nav aria-label="Нижнее меню">
    <LiquidGlassBlock className={styles.container}>
      {items.map((item, index) => (
        <Link
          key={'mobileNav-' + item.value + index}
          className={styles.item}
          href={'/' + item.value}
        >
          {item.icon}
          <Typography variant="body1">{item.label}</Typography>
        </Link>
      ))}
    </LiquidGlassBlock>
  </nav>
)
