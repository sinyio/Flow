'use client'

import { Ellipsis } from '@gravity-ui/icons'
import { Avatar, Button, DropdownMenu, Icon, User } from '@gravity-ui/uikit'

import { TChatAd, TChatUserSnippet } from '@api/chats/types'

import { formatUserName } from '@utils/format-user-name'

import { AdMiniCard } from '@components/molecules/ad-mini-card'

import styles from './component.module.css'

export interface IChatHeaderProps {
  otherUser: TChatUserSnippet
  ad: TChatAd
  rating?: number
  onMenuAction?: (action: string) => void
}

export const ChatHeader = ({ otherUser, ad, rating, onMenuAction }: IChatHeaderProps) => {
  const userName = formatUserName(otherUser)

  // Используем rating из otherUser или переданный через props
  const userRating = rating ?? otherUser.rating
  const ratingText = userRating ? `${userRating.toFixed(1)} ★★★★★` : undefined

  // Используем данные из ad если они есть, иначе заглушки
  const route = ad.fromCity && ad.toCity ? `${ad.fromCity} – ${ad.toCity}` : 'Маршрут не указан'
  const date =
    ad.startDate && ad.endDate
      ? `${new Date(ad.startDate).toLocaleDateString('ru-RU')} – ${new Date(ad.endDate).toLocaleDateString('ru-RU')}`
      : 'Дата не указана'
  const price = ad.price ?? 0

  const menuItems = [
    {
      text: 'Пожаловаться',
      action: () => onMenuAction?.('report'),
    },
    {
      text: 'Заблокировать',
      action: () => onMenuAction?.('block'),
    },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.userRow}>
        <User
          size="xl"
          name={userName}
          description={ratingText}
          avatar={<Avatar size="l" imgUrl={otherUser.photo || ''} />}
        />

        <DropdownMenu
          size="l"
          renderSwitcher={props => (
            <Button {...props} view="flat" size="l">
              <Icon data={Ellipsis} size={20} />
            </Button>
          )}
          items={menuItems}
        />
      </div>

      <AdMiniCard ad={ad} route={route} date={date} price={price} />
    </div>
  )
}
