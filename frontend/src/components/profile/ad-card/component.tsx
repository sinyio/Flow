import Image from 'next/image'
import { Button, Label, Text } from '@gravity-ui/uikit'

import { Card } from '../../templates/card'
import styles from './component.module.css'
import { statusesMap, TAd } from './types'

export interface IAdCardProps extends TAd {
  canEdit?: boolean
}

export const AdCard = ({ status, price, route, date, imageUrl, canEdit }: IAdCardProps) => (
  <Card className={styles.container}>
    <Label size="xs" {...statusesMap[status]}>
      {statusesMap[status].title}
    </Label>

    <div className={styles.content}>
      <Image width={100} height={100} alt="" src={imageUrl || '/profile/item.png'} />

      <div className={styles.rightContainer}>
        <div className={styles.priceAndRoute}>
          <Text variant="display-1" className={styles.text}>
            {price}
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
    {canEdit && status === 'active' ? (
      <Button view="action" size="l" style={{ width: '100%', marginTop: '8px' }}>
        Редактировать
      </Button>
    ) : null}
  </Card>
)
