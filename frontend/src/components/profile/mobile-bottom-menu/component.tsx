'use client'

import Link from 'next/link'

import styles from './component.module.scss'

interface MobileBottomMenuProps {
  active?: 'home' | 'media' | 'feed' | 'ad' | 'profile'
}

export const MobileBottomMenu = ({ active = 'profile' }: MobileBottomMenuProps) => (
  <nav className={styles.root} aria-label="Нижнее меню">
    <Link className={`${styles.item} ${active === 'home' ? styles.active : ''}`} href="/">
      главная
    </Link>
    <Link className={`${styles.item} ${active === 'media' ? styles.active : ''}`} href="#">
      медиа
    </Link>
    <Link className={`${styles.item} ${active === 'feed' ? styles.active : ''}`} href="#">
      лента
    </Link>
    <Link className={`${styles.item} ${active === 'ad' ? styles.active : ''}`} href="#">
      объявление
    </Link>
    <Link className={`${styles.item} ${active === 'profile' ? styles.active : ''}`} href="/profile">
      профиль
    </Link>
  </nav>
)
