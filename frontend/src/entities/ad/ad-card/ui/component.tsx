import { Button, Label, Text } from '@gravity-ui/uikit'
import Image from 'next/image'

import type { TAd } from '@api/ads'

import { getDate } from '@utils/get-date'

import { Card } from '@components/templates/card'

import styles from './component.module.css'
import { statusesMap } from '../types'

export interface IAdCardProps {
  ad: TAd
}

export const AdCard = ({ ad }: IAdCardProps) => {
  const route = `${ad.fromCity} – ${ad.toCity}`
  const date = `${getDate(ad.startDate)} – ${getDate(ad.endDate)}`

  return (
    <Card className={styles.container}>
      <Label size="xs" {...statusesMap[ad.status]}>
        {statusesMap[ad.status].title}
      </Label>

      <div className={styles.content}>
        <Image width={100} height={100} alt="" src={ad.image || '/profile/item.png'} />

        <div className={styles.rightContainer}>
          <div className={styles.priceAndRoute}>
            <Text variant="display-1" className={styles.text}>
              {ad.price} ₽
            </Text>
            <Text variant="subheader-3" className={styles.status}>
              {route}
            </Text>
          </div>
          <Text
            variant="body-1"
            style={{ color: 'var(--g-color-text-secondary)' }}
            className={styles.status}
          >
            {date}
          </Text>
        </div>
      </div>

      {ad.userState.canEdit && statusesMap[ad.status]?.canEdit ? (
        <Button view="action" size="l" style={{ width: '100%', marginTop: '8px' }}>
          Редактировать
        </Button>
      ) : null}
    </Card>
  )
}
