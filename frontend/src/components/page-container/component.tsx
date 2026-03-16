import { ReactNode } from 'react'

import styles from './component.module.css'

interface IPageContainerProps {
  children?: ReactNode
}

export const PageContainer = ({ children }: IPageContainerProps) => (
  <div className={styles.outerContainer}>
    <div className={styles.innerContainer}>{children}</div>
  </div>
)
