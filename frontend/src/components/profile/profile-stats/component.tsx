'use client'

import { Label } from '@gravity-ui/uikit'

import styles from './component.module.scss'

export interface ProfileStat {
  label: string
}

interface ProfileStatsProps {
  stats: ProfileStat[]
}

export const ProfileStats = ({ stats }: ProfileStatsProps) => (
  <div className={styles.root}>
    {stats.map(stat => (
      <Label key={stat.label} className={styles.stat} size="m">
        {stat.label}
      </Label>
    ))}
  </div>
)
