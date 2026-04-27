'use client'

import { EllipsisVertical } from '@gravity-ui/icons'
import { Avatar, Button, DropdownMenu, Icon, Text } from '@gravity-ui/uikit'

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

  const userRating = rating ?? otherUser.rating
  const ratingText = userRating ? `${userRating.toFixed(1)} ★★★★★` : undefined

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
      <div className={styles.userSection}>
        <div className={styles.userRow}>
          <Avatar className={styles.avatar} imgUrl={otherUser.photo || ''} />
          <div className={styles.userInfo}>
            <Text variant="body-2">{userName}</Text>
            {ratingText && (
              <Text variant="body-short" color="secondary">
                {ratingText}
              </Text>
            )}
          </div>
        </div>

        <DropdownMenu
          size="l"
          renderSwitcher={props => (
            <Button {...props} view="outlined" pin="round-round" className={styles.menuButton}>
              <Icon data={EllipsisVertical} size={24} />
            </Button>
          )}
          items={menuItems}
        />
      </div>

      <div className={styles.adSection}>
        <AdMiniCard ad={ad} route={route} date={date} price={price} />
      </div>
    </div>
  )
}
