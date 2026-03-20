'use client'

import { Accordion } from '@gravity-ui/uikit'
import { ReactNode } from 'react'

import styles from './component.module.css'
import { Typography } from '@components/typography/component'

export type TProfileDetailLine = {
  label: string
  value: string
  icon: ReactNode
}

interface IProfileDetailsProps {
  lines: TProfileDetailLine[]
}

export const ProfileDetails = ({ lines }: IProfileDetailsProps) => (
  <Accordion view="top-bottom" size="l" arrowPosition="end" className={styles.root}>
    <Accordion.Item
      defaultExpanded
      summary={<Typography variant="subheader3">Подробнее</Typography>}
      value="details"
    >
      <div className={styles.lines}>
        {lines.map(line => (
          <Typography variant="body2" key={`${line.label}-${line.value}`} className={styles.line}>
            {line.icon}
            <p>
              <span className={styles.muted}>{line.label}</span>{' '}
              <span className={styles.value}>{line.value}</span>
            </p>
          </Typography>
        ))}
      </div>
    </Accordion.Item>
  </Accordion>
)
