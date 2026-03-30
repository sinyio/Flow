import { TReviewsMutationResponse } from '../types'

export type TCreateReviewRequest = {
  adId: string
  rating: number
  text?: string | null
  isAnonymous?: boolean
}

/** Backend `putReview` возвращает `getStatusOk()`, не созданный отзыв */
export type TCreateReviewResponse = TReviewsMutationResponse
