import { TAd } from '@components/profile/ad-card/types'
import { Ads } from '@components/profile/profile-ads/component'
import { Reviews } from '@components/profile/profile-reviews/component'
import { AddIcon } from '@components/svgr/add-icon/icon'
import { ClockIcon } from '@components/svgr/clock-icon/icon'
import { CompassIcon } from '@components/svgr/compass-icon/icon'
import { FeedIcon } from '@components/svgr/feed-icon/icon'
import { HomeIcon } from '@components/svgr/home-icon/icon'
import { ProfileIcon } from '@components/svgr/profile-icon/icon'
import { StarIcon } from '@components/svgr/star-icon/icon'
import { VerifiedIcon } from '@components/svgr/verified-icon/icon'

export const mockProfileDetails = [
  { label: 'На флоу', value: 'с 10 марта 2026 года', icon: <ClockIcon /> },
  { label: 'Оставил', value: '4 отзыва', icon: <StarIcon /> },
  {
    label: 'Успешно доставил',
    value: '4 отправления',
    icon: <VerifiedIcon color={'rgba(0,0,0,0.5)'} />,
  },
]

const reviews = [
  {
    name: 'Андрей',
    date: '6 марта',
    role: 'Отправитель',
    rate: 5,
    status: 'Сделка состоялась',
    avatarUrl: '',
    description:
      'Все прошло отлично, Иван передал документы во время пересадки в Тбилиси. Спасибо за аккуратность и пунктуальность.',
  },
  {
    name: 'Андрей',
    date: '6 марта',
    role: 'Отправитель',
    rate: 2,
    status: 'Сделка состоялась',
    avatarUrl: '',
    description:
      'Все прошло отлично, Иван передал документы во время пересадки в Тбилиси. Спасибо за аккуратность и пунктуальность.',
  },
]

export const ads: TAd[] = [
  {
    status: 'active',
    price: '500 P',
    route: 'Москва - Тбилиси',
    date: '4 апреля - 14 апреля 2026',
    imageUrl: '',
  },
  {
    status: 'finished',
    price: '500 P',
    route: 'Москва - Тбилиси',
    date: '4 апреля - 14 апреля 2026',
    imageUrl: '',
  },
]

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

export const mockTabs = [
  {
    label: 'Отзывы',
    value: 'reviews',
    counter: reviews.length,
    content: <Reviews reviews={reviews} />,
  },
  { label: 'Объявления', value: 'ads', counter: ads.length, content: <Ads ads={ads} /> },
]
