import { AddIcon } from '@components/svgr/add-icon/icon'
import { CompassIcon } from '@components/svgr/compass-icon/icon'
import { FeedIcon } from '@components/svgr/feed-icon/icon'
import { HomeIcon } from '@components/svgr/home-icon/icon'
import { ProfileIcon } from '@components/svgr/profile-icon/icon'

export const mobileNavMocks = [
  {
    icon: <HomeIcon />,
    value: '',
    label: 'главная',
  },
  {
    icon: <CompassIcon />,
    value: 'media',
    label: 'медиа',
  },
  {
    icon: <FeedIcon />,
    value: 'feed',
    label: 'лента',
  },
  {
    icon: <AddIcon />,
    value: 'ad',
    label: 'объявление',
  },
  {
    icon: <ProfileIcon />,
    value: 'profile',
    label: 'профиль',
  },
]
