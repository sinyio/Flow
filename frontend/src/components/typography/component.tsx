import { HTMLAttributes } from 'react'

import styles from './component.module.css'

export const typographyMap = {
  body1: styles.body1,
  body1short: styles.body1short,
  body2: styles.body2,
  body3: styles.body3,
  header1: styles.header1,
  subheader2: styles.subheader2,
  subheader3: styles.subheader3,
  display1: styles.display1,
  display3: styles.display3,
  caption2: styles.caption2,
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
