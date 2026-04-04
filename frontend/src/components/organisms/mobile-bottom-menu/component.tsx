import { Link, Text } from '@gravity-ui/uikit'
import { ReactNode } from 'react'

import { LiquidGlassBlock } from '@components/global/liquid-glass-block'

import styles from './component.module.css'

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
          <Text variant="body-1">{item.label}</Text>
        </Link>
      ))}
    </LiquidGlassBlock>
  </nav>
)
