'use client'

import { Avatar, User } from '@gravity-ui/uikit'

import styles from './component.module.scss'

export interface ReviewCardProps {
  authorName: string
  authorMeta: string
  statusText: string
  text: string
}

export const ReviewCard = ({ authorName, authorMeta, statusText, text }: ReviewCardProps) => (
  <div className={styles.root}>
    <User
      size="l"
      name={authorName}
      description={authorMeta}
      avatar={<Avatar size="l" imgUrl="/profile/avatar.png" />}
      className={styles.user}
    />

    <div className={styles.status}>{statusText}</div>

    <div className={styles.text}>{text}</div>
  </div>
)
