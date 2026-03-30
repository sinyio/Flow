'use client'

import { Button, Icon, Text } from '@gravity-ui/uikit'
import { HTMLAttributes } from 'react'

import { PenIcon } from '@components/svgr/pen-icon/icon'
import { VerifiedIcon } from '@components/svgr/verified-icon/icon'
import styles from './component.module.css'
import { Stats } from '@components/stats'

export interface IProfileNameProps extends HTMLAttributes<HTMLDivElement> {
  name: string
  subtitle: string
  stats: string[]
  canEdit?: boolean
  isBackdrop?: boolean
}

export const ProfileName = ({
  name,
  subtitle,
  canEdit,
  stats,
  isBackdrop = true,
  ...rest
}: IProfileNameProps) => (
  <div
    {...rest}
    className={`${styles.info} ${isBackdrop ? styles.backdrop : ''} ${rest.className}`}
  >
    <div className={styles.nameContainer}>
      <Text variant="display-3" className={styles.name}>
        {name}
      </Text>
      <Text variant="body-3" className={styles.roleContainer}>
        <Icon data={VerifiedIcon} />
        <span className={styles.subtitle}>{subtitle}</span>
      </Text>
    </div>

    <div className={styles.bottomContainer}>
      {canEdit ? (
        <Button size="xl" width="max" view="normal" onClick={() => console.log(123)}>
          <Icon data={PenIcon} /> <Text variant="header-1">Редактировать</Text>
        </Button>
      ) : (
        <Button size="xl" width="max" view="action" onClick={() => console.log(123)}>
          <Text variant="header-1">Написать в чат</Text>
        </Button>
      )}

      <Stats stats={stats} labelProps={{ theme: 'unknown' }} />
    </div>
  </div>
)
