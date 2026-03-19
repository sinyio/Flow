import { HTMLAttributes, ReactNode } from 'react'

import styles from './component.module.css'

interface IPageContainerProps {
  children?: ReactNode
  outer?: HTMLAttributes<HTMLDivElement>
  inner?: HTMLAttributes<HTMLDivElement>
}

export const PageContainer = ({ children, outer, inner }: IPageContainerProps) => (
  <div {...outer} className={`${styles.outerContainer} ${outer?.className}`}>
    <div {...inner} className={`${styles.innerContainer} ${inner?.className}`}>
      {children}
    </div>
  </div>
)
