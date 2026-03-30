import { IApiError } from '@api/types'
import { TReviewPaginatedResponse, TReviewTargetRoleQuery } from '../types'

export type TGetReviewsByUserRequest = {
  userId: string
  page?: number
  limit?: number
  role?: TReviewTargetRoleQuery
}

export type TGetReviewsByUserResponse = TReviewPaginatedResponse | IApiError
