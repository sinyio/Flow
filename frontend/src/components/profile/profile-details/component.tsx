'use client'

import { Accordion } from '@gravity-ui/uikit'

import styles from './component.module.css'

export interface ProfileDetailLine {
  labelMuted: string
  value: string
}

interface ProfileDetailsProps {
  lines: ProfileDetailLine[]
}

export const ProfileDetails = ({ lines }: ProfileDetailsProps) => (
  <Accordion view="top-bottom" className={styles.root}>
    <Accordion.Item defaultExpanded summary="Подробнее" value="details">
      <div className={styles.lines}>
        {lines.map(line => (
          <div key={`${line.labelMuted}-${line.value}`} className={styles.line}>
            <span className={styles.muted}>{line.labelMuted}</span>
            <span className={styles.value}>{line.value}</span>
          </div>
        ))}
      </div>
    </Accordion.Item>
  </Accordion>
)
