import type { HTMLAttributes, ReactNode } from 'react'

import styles from './component.module.css'

interface LiquidGlassBlockProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export const LiquidGlassBlock = ({ children, className, ...rest }: LiquidGlassBlockProps) => (
  <div className={`${styles.bgLiquidGlass} ${className}`} {...rest}>
    {children}
  </div>
)
