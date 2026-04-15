'use client'

import Image from 'next/image'
import { useMemo } from 'react'

import { TAd } from '@api/ads'
import { TReview } from '@api/reviews/types'
import { TUser } from '@api/user/get-user'

import { getDate } from '@utils/get-date'
import { getNoun } from '@utils/get-noun'
import { useResponsive } from '@utils/hooks/use-responsive'

import { PageContainer } from '@components/global/page-container'
import { ClockIcon } from '@components/svgr/clock-icon/icon'
import { StarIcon } from '@components/svgr/star-icon/icon'
import { VerifiedIcon } from '@components/svgr/verified-icon/icon'
import { Tabs } from '@components/tabs/component'

import { Ads, ProfileDetails, ProfileHeader, ProfileName, Reviews } from '@widgets/profile'

import styles from './view.module.css'

export interface IProfileViewProps {
  user: TUser
  initialReviews?: TReview[]
  initialAds?: TAd[]
}

export const tabs = (reviews?: TReview[] | null, ads?: TAd[] | null) => [
  {
    label: 'Отзывы',
    value: 'reviews',
    counter: reviews?.length,
    content: reviews ? <Reviews reviews={reviews} /> : null,
  },
  {
    label: 'Объявления',
    value: 'ads',
    counter: ads?.length,
    content: ads ? <Ads ads={ads} /> : null,
  },
]

const ProfileView = ({ user, initialReviews = [], initialAds = [] }: IProfileViewProps) => {
  const { device } = useResponsive()

  const name = useMemo(() => {
    if (user?.firstName && !user?.lastName) {
      return user.firstName
    } else if (user?.firstName && user?.lastName) {
      return `${user?.firstName} ${user?.lastName}`
    } else {
      return 'Неизвестный пользователь'
    }
  }, [user?.firstName, user?.lastName])

  const stats = useMemo(
    () => [
      `${getNoun(user.receivedReviewsCount, 'отзыв', 'отзыва', 'отзывов')}`,
      `${getNoun(user.successfulDeliveriesCount, 'доставка', 'доставки', 'доставок')}`,
      `${getNoun(user.authoredAdsCount, 'объявление', 'объявления', 'объявлений')}`,
    ],
    [user.receivedReviewsCount, user.successfulDeliveriesCount, user.authoredAdsCount]
  )

  const profileDetails = [
    {
      label: 'На флоу',
      value: getDate(user?.registeredAt),
      icon: <ClockIcon />,
    },
    {
      label: 'Оставил',
      value: getNoun(Number(user.authoredReviewsCount), 'отзыв', 'отзыва', 'отзывов'),
      icon: <StarIcon />,
    },
    {
      label: 'Успешно доставил',
      value: getNoun(
        Number(user.successfulDeliveriesCount),
        'отправление',
        'отправления',
        'отправлений'
      ),
      icon: <VerifiedIcon color={'rgba(0,0,0,0.5)'} />,
    },
  ]

  if (device === 'mobile') {
    return (
      <PageContainer inner={{ className: styles.profilePageInner }}>
        <>
          <ProfileHeader
            canEdit={Boolean(user?.userState?.canEdit)}
            userId={user.id}
            name={name}
            subtitle="ответственный исполнитель"
            photoUrl={user?.photo || ''}
            stats={stats}
          />

          <div className={styles.profileDetails}>
            <ProfileDetails lines={profileDetails} />
          </div>

          <div className={styles.profileTabs}>
            <Tabs tabs={tabs(initialReviews, initialAds)} />
          </div>
        </>
      </PageContainer>
    )
  }

  return (
    <>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.profileName}>
            <ProfileName
              canEdit={Boolean(user?.userState?.canEdit)}
              userId={user.id}
              name={name}
              subtitle="ответственный исполнитель"
              stats={stats}
              isBackdrop={false}
            />
          </div>
        </div>
        <Image priority fill alt="" src={user?.photo} className={styles.backgroundImage} />
      </div>
      <PageContainer
        outer={{ className: styles.profilePageOuter }}
        inner={{ className: styles.profilePageInner }}
      >
        <div style={{ position: 'relative' }}>
          <Image
            priority
            width={455}
            height={606}
            alt=""
            src={user?.photo}
            className={styles.profileImage}
          />
        </div>
        <div className={styles.rightSide}>
          <div className={styles.profileDetails}>
            <ProfileDetails lines={profileDetails} />
          </div>

          <div className={styles.profileTabs}>
            <Tabs tabs={tabs(initialReviews, initialAds)} />
          </div>
        </div>
      </PageContainer>
    </>
  )
}

export default ProfileView
