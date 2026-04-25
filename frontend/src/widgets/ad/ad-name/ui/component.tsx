'use client'

import { Avatar, Button, Text, User } from '@gravity-ui/uikit'
import { useRouter } from 'next/navigation'
import { HTMLAttributes } from 'react'

import styles from './component.module.css'

export interface IAdNameProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  price: number
  authorName: string
  authorAvatarUrl?: string
  isBackdrop?: boolean
  adId?: string
  canEdit?: boolean
  responseCount?: number
}

function pluralResponse(n: number) {
  if (n % 100 >= 11 && n % 100 <= 14) return 'откликов'
  const r = n % 10
  if (r === 1) return 'отклик'
  if (r >= 2 && r <= 4) return 'отклика'
  return 'откликов'
}

export const AdName = ({
  title,
  price,
  authorName,
  authorAvatarUrl,
  isBackdrop = true,
  adId,
  canEdit = false,
  responseCount = 0,
  ...rest
}: IAdNameProps) => {
  const router = useRouter()

  return (
    <div
      {...rest}
      className={`${styles.info} ${isBackdrop ? styles.backdrop : ''} ${rest.className ?? ''}`}
    >
      <div className={styles.nameContainer}>
        <Text variant="display-3" color="inverted-primary" className={styles.title}>
          {title}
        </Text>

        <div className={styles.priceAuthorRow}>
          <Text variant="display-1" color="inverted-primary" className={styles.price}>
            {price} ₽
          </Text>
          <div className={styles.divider} />
          <User
            size="xl"
            name={authorName}
            className={styles.user}
            avatar={<Avatar size="l" imgUrl={authorAvatarUrl || ''} />}
          />
        </div>
      </div>

      {canEdit ? (
        <div className={styles.ownerActions}>
          <Text variant="body-2" color="inverted-primary">
            {responseCount === 0
              ? 'Откликов пока нет'
              : `${responseCount} ${pluralResponse(responseCount)}`}
          </Text>
          <Button
            size="xl"
            width="max"
            view="action"
            type="button"
            disabled={responseCount === 0}
            onClick={() => router.push(adId ? `/chats?adId=${adId}` : '/chats')}
          >
            <Text variant='header-1'>Посмотреть чаты</Text>
          </Button>
        </div>
      ) : (
        <Button
          size="xl"
          width="max"
          view="action"
          type="button"
          onClick={() => router.push(adId ? `/chats?adId=${adId}` : '/chats')}
        >
          <Text variant="header-1">Написать в чат</Text>
        </Button>
      )}
    </div>
  )
}
