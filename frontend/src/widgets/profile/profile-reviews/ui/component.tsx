import { ReviewCard } from '@entities/review'
import { TReview } from '@api/reviews'

export interface IReviewsProps {
  reviews: TReview[]
}

export const Reviews = ({ reviews }: IReviewsProps) =>
  reviews.map(review => <ReviewCard key={'review-' + review.id} review={review} />)
