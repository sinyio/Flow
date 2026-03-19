import { AnchorHTMLAttributes } from 'react'

import styles from './component.module.css'

export const TextLink = ({
  className,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a className={`${styles.textLink} ${className}`} {...rest}>
    {children}
  </a>
)
