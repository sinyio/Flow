'use client'

import { Label, Text } from '@gravity-ui/uikit'

import styles from './component.module.css'

export interface ProfileStat {
  label: string
}

interface ProfileStatsProps {
  stats: ProfileStat[]
}

export const ProfileStats = ({ stats }: ProfileStatsProps) => (
  <div className={styles.container}>
    {stats.map((stat, index) => (
      <Label key={stat.label + index} size="s">
        <Text variant="body-2">{stat.label}</Text>
      </Label>
    ))}
  </div>
)
