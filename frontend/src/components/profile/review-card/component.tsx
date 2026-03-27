import { Avatar, Button, Icon, Text, User } from '@gravity-ui/uikit'

import { Card } from '../../templates/card'
import styles from './component.module.css'
import { TReview } from './types'
import { StarFilledIcon } from '@components/svgr/star-filled-icon/icon'
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

    <Text variant="body-2" className={styles.status}>
      {Array.from(Array(5)).map((_, index) => (
        <StarFilledIcon
          key={'star-' + index}
          color={index <= rate - 1 ? 'var(--g-color-text-positive)' : 'gray'}
        />
      ))}
      {status}
    </Text>

    <Text variant="body-3" className={styles.text}>
      {description}
    </Text>
  </Card>
)
