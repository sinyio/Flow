'use client'

import { Button, Text } from '@gravity-ui/uikit'
import Image from 'next/image'
import { useMemo } from 'react'

import { TAd, TGetPopularRoutesResponse } from '@api/ads'

import { useResponsive } from '@utils/hooks/use-responsive'

import { AdCard } from '@entities/ad'

import { MediaCard } from '@components/atoms/media-card'
import { Route } from '@components/atoms/route/component'
import { PageContainer } from '@components/global/page-container'
import { DividerList } from '@components/molecules/divider-list/component'

import { HeroSearch } from '@widgets/search-block/component'

import styles from './view.module.css'

export interface IFeedViewProps {
  routes: TGetPopularRoutesResponse
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

export const FeedView = ({ routes }: IFeedViewProps) => {
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
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <Image
            fill
            priority
            src="/feed-hero.webp"
            alt=""
            className={styles.heroImage}
            aria-hidden="true"
          />

          <div className={styles.heroContent}>
            <HeroSearch routes={routes} />
          </div>
        </div>
      </div>

      <PageContainer inner={{ className: styles.pageInner }}>
        <section className={styles.section}>
          <Text variant="display-1" className={styles.sectionTitle}>
            Популярные
          </Text>
          <DividerList>
            {Array.isArray(routes) ? routes.map(route => <Route route={route} />) : null}
          </DividerList>
        </section>

        <section className={styles.section}>
          <div className={styles.mediaContainer}>
            {mockMedia.map(media => (
              <MediaCard {...media} />
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
              <AdCard ad={ad} />
            ))}
          </div>
          <Button view="action" size="xl" width={device === 'mobile' ? 'max' : 'auto'}>
            <Text variant="header-1">Создать объявление</Text>
          </Button>
        </section>
      </PageContainer>
    </>
  )
}

export default FeedView
