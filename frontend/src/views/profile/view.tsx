'use client'

import { useMemo } from 'react'

import { ProfileDetails, ProfileHeader } from '@components/profile'
import { Tabs } from '@components/tabs/component'
import { mockProfileDetails, mockTabs } from './mocks'
import { TUser } from '@api/user/get-user'
import { ClockIcon } from '@components/svgr/clock-icon/icon'
import { StarIcon } from '@components/svgr/star-icon/icon'
import { VerifiedIcon } from '@components/svgr/verified-icon/icon'
import { getNoun } from '@utils/get-noun'
import { getDate } from '@utils/get-date'

export interface IProfileViewProps {
  user?: TUser
}

const ProfileView = ({ user }: IProfileViewProps) => {
  const name = useMemo(() => {
    if (user?.firstName && !user?.lastName) {
      return user.firstName
    } else if (user?.firstName && user?.lastName) {
      return `${user?.firstName} ${user?.lastName}`
    } else {
      return 'Неизвестный пользователь'
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

  const canEdit = true

  return (
    <>
      <ProfileHeader canEdit={canEdit} name={name} subtitle="ответственный исполнитель" />

      <ProfileDetails lines={profileDetails} />

      <div style={{ margin: '0 16px' }}>
        <Tabs tabs={mockTabs(canEdit)} />
      </div>
    </>
  )
}

export default ProfileView
