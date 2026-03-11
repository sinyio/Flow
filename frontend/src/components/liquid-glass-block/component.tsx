import type { HTMLAttributes, ReactNode } from 'react'

import styles from './component.module.css'

interface LiquidGlassBlockProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export const LiquidGlassBlock = ({ children, ...rest }: LiquidGlassBlockProps) => (
  <div className={styles.bgLiquidGlass} {...rest}>
    {children}
  </div>
)
