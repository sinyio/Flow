import type { HTMLAttributes } from 'react'

import styles from './component.module.css'

export const Card = ({ children, className, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div className={`${styles.container} ${className}`} {...rest}>
    {children}
  </div>
)
