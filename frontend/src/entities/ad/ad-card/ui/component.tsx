'use client'

import { Text } from '@gravity-ui/uikit'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import type { TAd } from '@api/ads'

import { Card } from '@components/molecules/card'

import styles from './component.module.css'

export interface IAdCardProps {
  ad: TAd
}

export const AdCard = ({ ad }: IAdCardProps) => {
  const router = useRouter()
  const route = `${ad.fromCity} – ${ad.toCity}`

  const startDate = new Date(ad.startDate).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
  })
  const endDate = new Date(ad.endDate).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const date = `${startDate} – ${endDate}`

  return (
    <Card className={styles.container} onClick={() => router.push(`/ads/${ad.id}`)}>
      <div className={styles.imageWrapper}>
        <Image fill alt="" src={ad.image || '/profile/item.png'} className={styles.image} />
      </div>

      <div className={styles.info}>
        <Text variant="display-1">{ad.price} ₽</Text>
        <Text variant="subheader-3">{route}</Text>
        <Text variant="body-1" color="secondary">
          {date}
        </Text>
      </div>

    </Card>
  )
}
