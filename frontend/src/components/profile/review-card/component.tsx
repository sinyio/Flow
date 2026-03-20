import { Avatar, User } from '@gravity-ui/uikit'

import styles from './component.module.css'
import { TReview } from './types'
import { Typography } from '@components/typography/component'
import { StarFilledIcon } from '@components/svgr/star-filled-icon/icon'
import { Card } from '@components/card/component'

export const ReviewCard = ({ name, role, status, description, date, rate }: TReview) => (
  <Card>
    <User
      size="l"
      name={<Typography variant="body1short">{name}</Typography>}
      description={
        <Typography variant="body1short">
          {date} | {role}
        </Typography>
      }
      avatar={<Avatar size="l" imgUrl="/profile/avatar.png" />}
      className={styles.user}
    />

    <Typography variant="body2" className={styles.status}>
      {Array.from(Array(5)).map((_, index) => (
        <StarFilledIcon
          key={'star-' + index}
          color={index <= rate - 1 ? 'var(--g-color-text-positive)' : 'gray'}
        />
      ))}
      {status}
    </Typography>

    <Typography variant="body3" className={styles.text}>
      {description}
    </Typography>
  </Card>
)
