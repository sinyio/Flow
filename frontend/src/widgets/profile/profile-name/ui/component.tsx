'use client'

import { Button, Icon, Text } from '@gravity-ui/uikit'
import { useRouter } from 'next/navigation'
import { HTMLAttributes } from 'react'

import { Stats } from '@components/stats'
import { PenIcon } from '@components/svgr/pen-icon/icon'
import { VerifiedIcon } from '@components/svgr/verified-icon/icon'

import styles from './component.module.css'

export interface IProfileNameProps extends HTMLAttributes<HTMLDivElement> {
  name: string
  subtitle: string
  stats: string[]
  canEdit?: boolean
  /** Для перехода в настройки при «Редактировать» */
  userId?: string
  isBackdrop?: boolean
}

export const ProfileName = ({
  name,
  subtitle,
  canEdit,
  userId,
  stats,
  isBackdrop = true,
  ...rest
}: IProfileNameProps) => {
  const router = useRouter()

  return (
    <div
      {...rest}
      className={`${styles.info} ${isBackdrop ? styles.backdrop : ''} ${rest.className ?? ''}`}
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
          <Button
            type="button"
            size="xl"
            width="max"
            view="normal"
            disabled={!userId}
            onClick={() => {
              if (userId) {
                router.push(`/profile/settings/${userId}`)
              }
            }}
          >
            <Icon data={PenIcon} /> <Text variant="header-1">Редактировать</Text>
          </Button>
        ) : (
          <Button
            size="xl"
            width="max"
            view="action"
            type="button"
            onClick={() => router.push(userId ? `/chats?userId=${userId}` : '/chats')}
          >
            <Text variant="header-1">Написать в чат</Text>
          </Button>
        )}

        <Stats stats={stats} labelProps={{ theme: 'unknown' }} />
      </div>
    </div>
  )
}
