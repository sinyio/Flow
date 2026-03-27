'use client'

import { useMemo } from 'react'
import Image from 'next/image'

import { ProfileDetails, ProfileHeader } from '@components/profile'
import { Tabs } from '@components/tabs/component'
import { mockProfileDetails, mockTabs } from './mocks'
import { TUser } from '@api/user/get-user'
import { ClockIcon } from '@components/svgr/clock-icon/icon'
import { StarIcon } from '@components/svgr/star-icon/icon'
import { VerifiedIcon } from '@components/svgr/verified-icon/icon'
import { getNoun } from '@utils/get-noun'
import { getDate } from '@utils/get-date'
import { ProfileName } from '@components/profile/profile-name/component'
import { useResponsive } from '@utils/hooks/use-responsive'
import styles from './view.module.css'
import { PageContainer } from '@components/global/page-container'

export interface IProfileViewProps {
  user?: TUser
}

const ProfileView = ({ user }: IProfileViewProps) => {
  const { device } = useResponsive()

  const name = useMemo(() => {
    if (user?.firstName && !user?.lastName) {
      return user.firstName
    } else if (user?.firstName && user?.lastName) {
      return `${user?.firstName} ${user?.lastName}`
    } else {
      return 'Дмитрий Смотряев'
    }
  }, [user?.firstName, user?.lastName])

  const profileDetails = !user
    ? mockProfileDetails
    : [
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

  const canEdit = false

  return (
    <>
      {device === 'mobile' ? (
        <PageContainer inner={{ className: styles.profilePageInner }}>
          <>
            <ProfileHeader canEdit={canEdit} name={name} subtitle="ответственный исполнитель" />

            <div className={styles.profileDetails}>
              <ProfileDetails lines={profileDetails} />
            </div>

            <div className={styles.profileTabs}>
              <Tabs tabs={mockTabs(canEdit)} />
            </div>
          </>
        </PageContainer>
      ) : (
        <>
          <div className={styles.hero}>
            <div className={styles.heroInner}>
              <div className={styles.profileName}>
                <ProfileName
                  canEdit={canEdit}
                  name={name}
                  subtitle="ответственный исполнитель"
                  isBackdrop={false}
                />
              </div>
            </div>
            <Image
              priority
              fill
              alt=""
              src="/profile/profile-head.png"
              className={styles.backgroundImage}
            />
          </div>
          <PageContainer inner={{ className: styles.profilePageInner }}>
            <Image
              priority
              width={455}
              height={606}
              alt=""
              src="/profile/profile-head.png"
              className={styles.profileImage}
            />
            <div className={styles.rightSide}>
              <div className={styles.profileDetails}>
                <ProfileDetails lines={profileDetails} />
              </div>

              <div className={styles.profileTabs}>
                <Tabs tabs={mockTabs(canEdit)} />
              </div>
            </div>
          </PageContainer>
        </>
      )}
    </>
  )
}

export default ProfileView
