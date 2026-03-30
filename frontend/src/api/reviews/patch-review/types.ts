import { IApiError } from '@api/types'

import { TReview } from '../types'

export type TPatchReviewRequest = {
  id: string
  rating: number
  text?: string | null
}

export type TPatchReviewResponse = TReview | IApiError
