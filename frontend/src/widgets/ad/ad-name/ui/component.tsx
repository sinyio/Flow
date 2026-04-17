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
}

export const AdName = ({
  title,
  price,
  authorName,
  authorAvatarUrl,
  isBackdrop = true,
  adId,
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

      <Button
        size="xl"
        width="max"
        view="action"
        type="button"
        onClick={() => router.push(adId ? `/chats?adId=${adId}` : '/chats')}
      >
        <Text variant="header-1">Написать в чат</Text>
      </Button>
    </div>
  )
}
