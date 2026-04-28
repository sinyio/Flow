'use client'

import { ArrowLeft, EllipsisVertical } from '@gravity-ui/icons'
import { Avatar, Button, DropdownMenu, Icon, Text } from '@gravity-ui/uikit'
import Link from 'next/link'

import { TChatAd, TChatUserSnippet } from '@api/chats/types'

import { formatUserName } from '@utils/format-user-name'

import { AdMiniCard } from '@components/molecules/ad-mini-card'

import styles from './component.module.css'

export interface IChatHeaderProps {
  otherUser: TChatUserSnippet
  ad: TChatAd
  rating?: number
  onMenuAction?: (action: string) => void
  onBack?: () => void
}

export const ChatHeader = ({ otherUser, ad, rating, onMenuAction, onBack }: IChatHeaderProps) => {
  const userName = formatUserName(otherUser)

  const userRating = rating ?? otherUser.rating ?? 0
  const filledStars = Math.round(userRating)
  const ratingText = `${userRating.toFixed(1).replace('.', ',')} ${'★'.repeat(filledStars)}${'☆'.repeat(5 - filledStars)}`

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
          {onBack && (
            <Button
              view="outlined"
              pin="round-round"
              className={styles.backButton}
              onClick={onBack}
            >
              <Icon data={ArrowLeft} size={24} />
            </Button>
          )}
          <Link href={`/profile/${otherUser.id}`} className={styles.userLink}>
            <Avatar className={styles.avatar} imgUrl={otherUser.photo || ''} />
            <div className={styles.userInfo}>
              <Text variant="body-2">{userName}</Text>
              <Text variant="body-short" color="secondary">
                {ratingText}
              </Text>
            </div>
          </Link>
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
