import { TPaginationMeta } from '@api/ads'
import { IApiError } from '@api/types'

import { TReview } from '../types'

export type TReviewTargetRoleQuery = 'courier' | 'customer' | 'all'

export type TGetReviewsByUserRequest = {
  userId: string
  page?: number
  limit?: number
  role?: TReviewTargetRoleQuery
}

export type TGetReviewsByUserResponse = { data: TReview[]; meta: TPaginationMeta } | IApiError
