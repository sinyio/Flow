import Image from 'next/image'
import { Button, Label } from '@gravity-ui/uikit'

import styles from './component.module.css'
import { Typography } from '@components/typography/component'
import { Card } from '@components/card/component'
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
          <Typography variant="display1" className={styles.text}>
            {price}
          </Typography>
          <Typography variant="subheader3" className={styles.status}>
            {route}
          </Typography>
        </div>
        <Typography
          variant="body1"
          style={{ color: 'var(--g-color-text-secondary)' }}
          className={styles.status}
        >
          {date}
        </Typography>
      </div>
    </div>
    {canEdit && status === 'active' ? (
      <Button view="action" size="l" style={{ width: '100%', marginTop: '8px' }}>
        Редактировать
      </Button>
    ) : null}
  </Card>
)
