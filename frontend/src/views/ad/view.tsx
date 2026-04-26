'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { TAd } from '@api/ads'
import { respondToAd } from '@api/ads'
import { useAxiosInstance } from '@api/use-axios-instance'

import { useResponsive } from '@utils/hooks/use-responsive'

import { PageContainer } from '@components/global/page-container'

import { AdHeader, AdName } from '@widgets/ad'
import { AdDetails } from '@widgets/ad/ad-details'
import { Header } from '@widgets/profile/profile-header'

import styles from './view.module.css'

export interface IAdViewProps {
  ad: TAd
}

export const AdView = ({ ad }: IAdViewProps) => {
  const { device } = useResponsive()
  const router = useRouter()
  const axiosInstance = useAxiosInstance()
  const [responding, setResponding] = useState(false)

  const handleRespond = async () => {
    setResponding(true)
    try {
      const { data } = await respondToAd(ad.id, axiosInstance)
      if ('chatId' in data) router.push(`/chats/${data.chatId}`)
    } finally {
      setResponding(false)
    }
  }

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
            adId={ad.id}
            canEdit={ad.userState.canEdit}
            responseCount={ad.userState.responseCount}
            hasResponded={ad.userState.hasResponded}
            chatId={ad.userState.chatId}
            onRespond={handleRespond}
            responding={responding}
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
        <Header canEdit={ad.userState.canEdit} adId={ad.id} className={styles.heroHeader} />
        <div className={styles.heroInner}>
          <div className={styles.adName}>
            <AdName
              title={ad.title}
              price={ad.price}
              authorName={ad?.author?.fullName}
              authorAvatarUrl={ad?.author?.photo || ''}
              isBackdrop={false}
              adId={ad.id}
              canEdit={ad.userState.canEdit}
              responseCount={ad.userState.responseCount}
              hasResponded={ad.userState.hasResponded}
              chatId={ad.userState.chatId}
              onRespond={handleRespond}
              responding={responding}
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
