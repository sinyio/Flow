'use client'

import { ArrowLeft } from '@gravity-ui/icons'
import { Avatar, Button, Icon, User } from '@gravity-ui/uikit'
import { useRouter } from 'next/navigation'

import { TReview } from '@api/reviews/types'
import { TUser } from '@api/user/get-user/types'

import { CreateReviewForm } from './form/component'
import styles from './view.module.css'

export interface ICreateReviewViewProps {
  user: TUser
  adId: string
  reviews: TReview[]
  reviewTitle: string
}

export const CreateReviewView = ({ user, adId, reviews, reviewTitle }: ICreateReviewViewProps) => {
  const router = useRouter()

  // Вычисляем средний рейтинг
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
      : null

  const userName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Пользователь'

  const ratingText = averageRating
    ? `${averageRating} ${Array(5).fill('★').join('')}`
    : 'Нет отзывов'

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button view="flat" size="l" onClick={() => router.back()} className={styles.backButton}>
          <Icon data={ArrowLeft} size={20} />
        </Button>

        <User
          size="l"
          name={userName}
          description={ratingText}
          avatar={
            <Avatar size="l" imgUrl={user.photo || ''} alt={userName} className={styles.avatar} />
          }
        />
      </div>

      <CreateReviewForm adId={adId} title={reviewTitle} />
    </div>
  )
}
