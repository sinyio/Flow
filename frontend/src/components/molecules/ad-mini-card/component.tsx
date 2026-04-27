'use client'

import { Text } from '@gravity-ui/uikit'
import Image from 'next/image'

import { TChatAd } from '@api/chats/types'

import styles from './component.module.css'

export interface IAdMiniCardProps {
  ad: TChatAd
  route: string
  date: string
  price: number
}

export const AdMiniCard = ({ ad, route, date, price }: IAdMiniCardProps) => (
  <div className={styles.container}>
    <Image
      width={50}
      height={50}
      alt={ad.title}
      src={ad.image || '/profile/item.png'}
      className={styles.image}
    />

    <div className={styles.info}>
      <Text variant="subheader-3" className={styles.title}>
        {ad.title}
      </Text>

      <div className={styles.detailsRow}>
        <Text variant="body-2" color="secondary">
          {route}
        </Text>
        <Text variant="body-2" color="secondary">
          {date}
        </Text>
        <Text variant="body-2" color="secondary">
          {price} ₽
        </Text>
      </div>
    </div>
  </div>
)
