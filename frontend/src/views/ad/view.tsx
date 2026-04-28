'use client'

import { useState } from 'react'
import Image from 'next/image'

import { Link, useToaster } from '@gravity-ui/uikit'
import { useRouter } from 'next/navigation'

import { TAd, deleteAd, respondToAd } from '@api/ads'
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
  const axiosInstance = useAxiosInstance()
  const { add } = useToaster()
  const router = useRouter()
  const [responding, setResponding] = useState(false)
  const [hasResponded, setHasResponded] = useState(ad.userState.hasResponded)
  const [chatId, setChatId] = useState(ad.userState.chatId)

  const handleDeleteAd = async () => {
    await deleteAd(ad.id, axiosInstance)
    add({ name: 'delete_ad', theme: 'success', title: 'Объявление удалено', isClosable: true })
    router.back()
  }

  const handleRespond = async () => {
    setResponding(true)
    try {
      const { data } = await respondToAd(ad.id, axiosInstance)
      if ('chatId' in data) {
        setHasResponded(true)
        setChatId(data.chatId)
        add({
          name: 'respond_ok',
          theme: 'success',
          title: 'Вы откликнулись!',
          isClosable: true,
          content: (
            <Link href={`/chats/${data.chatId}`} style={{ color: 'var(--g-color-text-secondary)' }}>Перейти в чат</Link>
          ),
        })
      }
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
            authorId={ad.author.id}
            adId={ad.id}
            canEdit={ad.userState.canEdit}
            responseCount={ad.userState.responseCount}
            hasResponded={hasResponded}
            chatId={chatId}
            onRespond={handleRespond}
            responding={responding}
            onDeleteAd={handleDeleteAd}
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
        <Header canEdit={ad.userState.canEdit} adId={ad.id} onDeleteAd={handleDeleteAd} className={styles.heroHeader} />
        <div className={styles.heroInner}>
          <div className={styles.adName}>
            <AdName
              title={ad.title}
              price={ad.price}
              authorName={ad?.author?.fullName}
              authorAvatarUrl={ad?.author?.photo || ''}
              authorId={ad?.author?.id}
              isBackdrop={false}
              adId={ad.id}
              canEdit={ad.userState.canEdit}
              responseCount={ad.userState.responseCount}
              hasResponded={hasResponded}
              chatId={chatId}
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
