'use client'

import Link from 'next/link'

import { useCurrentUserStore } from '@utils/stores/current-user'

import styles from './component.module.css'

export const AdminFab = () => {
  const { userId } = useCurrentUserStore()

  if (userId !== 'adminuser') return null

  return (
    <Link href="/admin" className={styles.fab} aria-label="Админ-панель">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10 2L12.4 7.26L18 8.18L14 12.08L14.9 17.66L10 15.1L5.1 17.66L6 12.08L2 8.18L7.6 7.26L10 2Z"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  )
}
