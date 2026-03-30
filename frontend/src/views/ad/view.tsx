'use client'

import Image from 'next/image'
import { Text } from '@gravity-ui/uikit'

import { PageContainer } from '@components/global/page-container'
import { useResponsive } from '@utils/hooks/use-responsive'
import styles from './view.module.css'
import { TAd } from '@api/ads'

import { AdHeader, AdName } from '@widgets/ad'
import { AdDetails } from '@widgets/ad/ad-details'

export interface IAdViewProps {
  ad: TAd
}

export const AdView = ({ ad }: IAdViewProps) => {
  const { device } = useResponsive()

  if (device === 'mobile') {
    return (
      <PageContainer inner={{ className: styles.adPageInner }}>
        <>
          <AdHeader
            imageUrl={ad.image || ''}
            title={ad.title}
            price={ad.price}
            authorName={ad.author.fullName || ''}
            authorAvatarUrl={ad.author.photo || ''}
          />

          <div className={styles.adDetails}>
            <AdDetails ad={ad} />
          </div>
        </>
      </PageContainer>
    )
  }

  return (
    <>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.adName}>
            <AdName
              title={ad.title}
              price={ad.price}
              authorName={ad?.author?.fullName}
              authorAvatarUrl={ad?.author?.photo || ''}
              isBackdrop={false}
            />
          </div>
        </div>
        <Image priority fill alt="" src={ad.image || ''} className={styles.backgroundImage} />
      </div>

      <PageContainer
        outer={{ className: styles.adPageOuter }}
        inner={{ className: styles.adPageInner }}
      >
        <div style={{ position: 'relative' }}>
          <Image
            priority
            width={455}
            height={606}
            alt=""
            src={ad.image || ''}
            className={styles.adImage}
          />
        </div>

        <div className={styles.rightSide}>
          <AdDetails ad={ad} />
        </div>
      </PageContainer>
    </>
  )
}
