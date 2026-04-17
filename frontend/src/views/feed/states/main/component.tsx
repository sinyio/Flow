'use client'

import { Button, Text } from '@gravity-ui/uikit'
import { useMemo } from 'react'

import { TAd, TGetPopularRoutesResponse } from '@api/ads'

import { useResponsive } from '@utils/hooks/use-responsive'

import { AdCard } from '@entities/ad'

import { MediaCard } from '@components/atoms/media-card'
import { Route } from '@components/atoms/route'
import { DividerList } from '@components/molecules/divider-list/component'

import styles from './component.module.css'

export interface IMainStateProps {
  routes?: TGetPopularRoutesResponse
}

const mockMedia = [
  {
    imageUrl: '/media/1.png',
    title: 'Как работает Флоу?',
  },
  {
    imageUrl: '/media/2.png',
    title: 'Сколько стоит услуга?',
  },
]

export const MainState = ({ routes }: IMainStateProps) => {
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
        <Text variant="display-1" className={styles.sectionTitle}>
          Популярные
        </Text>
        <DividerList>
          {Array.isArray(routes)
            ? routes.map(route => (
                <Route key={route.fromCity + '__' + route.toCity} route={route} />
              ))
            : null}
        </DividerList>
      </section>

      <section className={styles.section}>
        <div className={styles.mediaContainer}>
          {mockMedia.map(media => (
            <MediaCard key={media.title} {...media} />
          ))}
        </div>
        <Button view="action" size="xl" width={device === 'mobile' ? 'max' : 'auto'}>
          <Text variant="header-1">Читать больше в нашем медиа</Text>
        </Button>
      </section>

      <section className={styles.section}>
        <Text variant="display-1" className={styles.sectionTitle}>
          Новые объявления
        </Text>
        <div className={styles.adsContainer}>
          {latestAds.map(ad => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
        <Button view="action" size="xl" width={device === 'mobile' ? 'max' : 'auto'}>
          <Text variant="header-1">Создать объявление</Text>
        </Button>
      </section>
    </>
  )
}
