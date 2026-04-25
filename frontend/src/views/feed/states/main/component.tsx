'use client'

import { Button, Text } from '@gravity-ui/uikit'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

import { TAd, TGetPopularRoutesResponse } from '@api/ads'

import { useResponsive } from '@utils/hooks/use-responsive'

import { AdCard } from '@entities/ad'

import { MediaCard } from '@components/atoms/media-card'

import styles from './component.module.css'

export interface IMainStateProps {
  routes?: TGetPopularRoutesResponse
}

const mockMedia = [
  {
    imageUrl: '/media/1.jpg',
    title: 'Как работает Флоу?',
  },
  {
    imageUrl: '/media/2.jpg',
    title: 'Сколько стоит услуга?',
  },
]

export const MainState = ({ routes }: IMainStateProps) => {
  const router = useRouter()
  const { device } = useResponsive()

  const latestAds = useMemo(
    () =>
      Array.isArray(routes)
        ? routes.reduce((acc, route) => acc.concat(route.latestAds), [] as TAd[])
        : [],
    [routes]
  )

  return (
    <>
      <section className={styles.section}>
        <div className={styles.mediaContainer}>
          {mockMedia.map(media => (
            <MediaCard key={media.title} {...media} />
          ))}
        </div>
        <Button view="action" size="xl" width={device === 'mobile' ? 'max' : 'auto'} onClick={() => router.push('/media')}>
          <Text variant="header-1">Читать больше в нашем медиа</Text>
        </Button>
      </section>

      <section className={styles.section}>
        <Text variant="display-3" className={styles.sectionTitle}>
          Новые объявления
        </Text>
        <div className={styles.adsContainer}>
          {latestAds.map(ad => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
        <Button view="action" size="xl" width={device === 'mobile' ? 'max' : 'auto'} onClick={() => router.push('/ads')}>
          <Text variant="header-1">Создать объявление</Text>
        </Button>
      </section>
    </>
  )
}
