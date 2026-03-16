import { HTMLAttributes } from 'react'

import styles from './component.module.css'

export const typographyMap = {
  body1: styles.body1,
  body2: styles.body2,
  header1: styles.header1,
  subheader2: styles.subheader2,
  display3: styles.display3,
}

interface ITypographyProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof typographyMap
}

export const Typography = ({
  variant = 'body1',
  className,
  children,
  ...rest
}: ITypographyProps) => (
  <span className={`${typographyMap[variant]} ${className}`} {...rest}>
    {children}
  </span>
)
