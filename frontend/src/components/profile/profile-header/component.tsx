'use client'

import Image from 'next/image'
import type { ReactNode } from 'react'
import { Button } from '@gravity-ui/uikit'

import styles from './component.module.scss'

interface ProfileHeaderProps {
  name: string
  role: string
  onMessage?: () => void
  leftAction?: ReactNode
  rightAction?: ReactNode
}

export const ProfileHeader = ({
  name,
  role,
  onMessage,
  leftAction,
  rightAction,
}: ProfileHeaderProps) => {
  const hasActions = Boolean(leftAction || rightAction)

  return (
    <section className={styles.root}>
      <div className={styles.hero}>
        <Image
          priority
          fill
          alt=""
          src="/profile/profile-head.png"
          className={styles.heroImage}
          sizes="(max-width: 500px) 100vw, 900px"
        />

        {hasActions ? (
          <div aria-hidden className={styles.heroActions}>
            {leftAction ? <div className={styles.circleButton}>{leftAction}</div> : <span />}
            {rightAction ? <div className={styles.circleButton}>{rightAction}</div> : <span />}
          </div>
        ) : null}
      </div>

      <div className={styles.info}>
        <h1 className={styles.name}>{name}</h1>
        <div className={styles.roleRow}>
          <span aria-hidden className={styles.roleIcon} />
          <span className={styles.role}>{role}</span>
        </div>

        <Button size="xl" view="action" className={styles.messageButton} onClick={onMessage}>
          Написать
        </Button>
      </div>
    </section>
  )
}
