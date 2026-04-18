'use client'

import { Text } from '@gravity-ui/uikit'
import Image from 'next/image'

import { TChatAd } from '@api/chats/types'

import { Card } from '@components/templates/card'

import styles from './component.module.css'

export interface IAdMiniCardProps {
  ad: TChatAd
  route: string
  date: string
  price: number
}

export const AdMiniCard = ({ ad, route, date, price }: IAdMiniCardProps) => (
  <Card className={styles.container}>
    <Image
      width={80}
      height={80}
      alt={ad.title}
      src={ad.image || '/profile/item.png'}
      className={styles.image}
    />

    <div className={styles.info}>
      <Text variant="subheader-2" className={styles.title}>
        {ad.title}
      </Text>

      <Text variant="body-2" color="secondary">
        {route}
      </Text>

      <div className={styles.priceRow}>
        <Text variant="body-2" color="secondary">
          {date}
        </Text>
        <Text variant="display-1">{price} ₽</Text>
      </div>
    </div>
  </Card>
)
