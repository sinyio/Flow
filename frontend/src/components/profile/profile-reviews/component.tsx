import { IReviewsProps } from './types'
import { ReviewCard } from '../review-card/component'

export const Reviews = ({ reviews }: IReviewsProps) =>
  reviews.map((review, index) => <ReviewCard key={'review-' + review.name + index} {...review} />)
