import { TReviewsMutationResponse } from '../types'

export type TCreateReviewRequest = {
  adId: string
  rating: number
  text?: string | null
  isAnonymous?: boolean
}

export type TCreateReviewResponse = TReviewsMutationResponse
