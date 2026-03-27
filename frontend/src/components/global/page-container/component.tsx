import { HTMLAttributes, ReactNode } from 'react'

import styles from './component.module.css'

interface IPageContainerProps {
  children?: ReactNode
  outer?: HTMLAttributes<HTMLDivElement>
  inner?: HTMLAttributes<HTMLDivElement>
}

export const PageContainer = ({ children, outer, inner }: IPageContainerProps) => (
  <div {...outer} className={`${outer?.className} ${styles.outerContainer}`}>
    <div {...inner} className={`${inner?.className} ${styles.innerContainer}`}>
      {children}
    </div>
  </div>
)
