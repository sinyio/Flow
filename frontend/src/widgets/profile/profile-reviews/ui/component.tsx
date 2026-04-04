import { TReview } from '@api/reviews'

import { ReviewCard } from '@entities/review'

export interface IReviewsProps {
  reviews: TReview[]
}

export const Reviews = ({ reviews }: IReviewsProps) =>
  reviews.map(review => <ReviewCard key={'review-' + review.id} review={review} />)
