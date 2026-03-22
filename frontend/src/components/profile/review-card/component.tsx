import { Avatar, Button, Icon, User } from '@gravity-ui/uikit'

import styles from './component.module.css'
import { TReview } from './types'
import { Typography } from '@components/typography/component'
import { StarFilledIcon } from '@components/svgr/star-filled-icon/icon'
import { Card } from '@components/card/component'
import { FlagIcon } from '@components/svgr/flag-icon/icon'

export interface IReviewCardProps extends TReview {
  canReport: boolean
}

export const ReviewCard = ({
  canReport,
  name,
  role,
  status,
  description,
  date,
  rate,
}: IReviewCardProps) => (
  <Card>
    <div className={styles.topContainer}>
      <User
        size="l"
        name={name}
        description={`${date} | ${role}`}
        avatar={<Avatar size="l" imgUrl="/profile/avatar.png" />}
        className={styles.user}
      />

      {canReport && (
        <Button view="flat-danger" size="xs">
          <Icon data={FlagIcon} />
          Пожаловаться
        </Button>
      )}
    </div>

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
