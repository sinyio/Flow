'use client'

import { Label } from '@gravity-ui/uikit'

import styles from './component.module.css'
import { Typography } from '@components/typography/component'

export interface ProfileStat {
  label: string
}

interface ProfileStatsProps {
  stats: ProfileStat[]
}

export const ProfileStats = ({ stats }: ProfileStatsProps) => (
  <div className={styles.root}>
    {stats.map((stat, index) => (
      <Label key={stat.label + index} size="s">
        <Typography variant="body2">{stat.label}</Typography>
      </Label>
    ))}
  </div>
)
