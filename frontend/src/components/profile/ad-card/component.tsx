import Image from 'next/image'
import { Label, LabelProps } from '@gravity-ui/uikit'

import styles from './component.module.css'
import { Typography } from '@components/typography/component'
import { Card } from '@components/card/component'
import { TAd, TStatus } from './types'

const statusesMap: Record<TStatus, { title: string; theme?: LabelProps['theme'] }> = {
  active: {
    title: 'Активно',
    theme: 'success',
  },
  finished: {
    title: 'Завершено',
  },
}

export const AdCard = ({ status, price, route, date, imageUrl }: TAd) => (
  <Card className={styles.container}>
    <Label size="xs" {...statusesMap[status]}>
      <Typography variant="body1">{statusesMap[status].title}</Typography>
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
  </Card>
)
