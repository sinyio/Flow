import Image from 'next/image'
import { Text } from '@gravity-ui/uikit'

import { TGetAdsParams, TGetAdsResponse, TGetPopularRoutesResponse } from '@api/ads'

import { PageContainer } from '@components/global/page-container'
import { Route } from '@components/atoms/route'

import { HeroSearch } from '@widgets/search-block/component'

import { AdsState } from './states/ads/component'
import { MainState } from './states/main/component'
import styles from './view.module.css'

export interface IFeedViewProps {
  routes?: TGetPopularRoutesResponse
  ads?: TGetAdsResponse
  settings?: TGetAdsParams
}

export const FeedView = ({ routes, ads, settings }: IFeedViewProps) => (
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
          <HeroSearch routes={routes} settings={settings} />
        </div>
      </div>
    </div>

    {!settings && Array.isArray(routes) && routes.length > 0 && (
      <div className={styles.popularStrip}>
        <div className={styles.popularInner}>
          <Text variant="display-3">Популярные</Text>
          <div className={styles.popularRoutes}>
            {routes.map(route => (
              <Route key={route.fromCity + '__' + route.toCity} route={route} />
            ))}
          </div>
        </div>
      </div>
    )}

    <PageContainer inner={{ className: styles.pageInner }}>
      {settings ? <AdsState ads={ads} /> : <MainState routes={routes} />}
    </PageContainer>
  </>
)

export default FeedView
