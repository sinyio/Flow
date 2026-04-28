'use client'

import Image from 'next/image'

import { useResponsive } from '@utils/hooks/use-responsive'

import styles from './view.module.css'

export const HeroImage = () => {
  const { device } = useResponsive()

  return (
    <Image
      fill
      priority
      src={device === 'desktop' ? '/feed-hero-desktop.webp' : '/feed-hero.webp'}
      alt=""
      className={styles.heroImage}
      aria-hidden="true"
    />
  )
}
