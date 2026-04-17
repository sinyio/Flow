import { Avatar, Button, Icon, Text, User } from '@gravity-ui/uikit'

import { TReview } from '@api/reviews'

import { FlagIcon } from '@components/svgr/flag-icon/icon'
import { StarFilledIcon } from '@components/svgr/star-filled-icon/icon'
import { Card } from '@components/templates/card'

import styles from './component.module.css'

export interface IReviewCardProps {
  review: TReview
}

export const ReviewCard = ({ review }: IReviewCardProps) => (
  <Card>
    <div className={styles.topContainer}>
      <User
        size="l"
        name={review.author?.fullName}
        description={`${review.createdAt} | ${review.type}`}
        avatar={<Avatar size="l" imgUrl="/profile/avatar.png" />}
        className={styles.user}
      />

      {review.userState.canEdit && (
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
          color={index <= review.rating - 1 ? 'var(--g-color-text-positive)' : 'gray'}
        />
      ))}
    </Text>

    <Text variant="body-3" className={styles.text}>
      {review.text}
    </Text>
  </Card>
)
