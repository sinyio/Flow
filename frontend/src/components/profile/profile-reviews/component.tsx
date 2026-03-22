import { ReviewCard } from '../review-card/component'
import { TReview } from '../review-card/types'

export interface IReviewsProps {
  reviews: TReview[]
  canReport: boolean
}

export const Reviews = ({ reviews, canReport }: IReviewsProps) =>
  reviews.map((review, index) => (
    <ReviewCard key={'review-' + review.name + index} {...review} canReport={canReport} />
  ))
