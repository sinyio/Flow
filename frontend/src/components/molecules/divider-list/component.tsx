import { Children, Fragment, PropsWithChildren } from 'react'

import styles from './component.module.css'

export const DividerList = ({ children }: PropsWithChildren) => {
  const childrenCount = Children.count(children)

  return (
    <div className={styles.container}>
      {Children.map(children, (child, index) => (
        <Fragment key={index}>
          {child}
          {index + 1 < childrenCount && <div className={styles.divider} />}
        </Fragment>
      ))}
    </div>
  )
}
