import { IApiError } from '@api/types'

export type TReviewsStatusOk = {
  status: 'ok'
}

export type TReviewsMutationResponse = TReviewsStatusOk | IApiError

export type TPaginationMeta = {
  page: number
  limit: number
  total: number
  pages: number
}

export type TReviewType = 'CUSTOMER_TO_COURIER' | 'COURIER_TO_CUSTOMER'

export type TReviewTargetRoleQuery = 'courier' | 'customer' | 'all'

export type TReviewUserSnippet = {
  id: string
  fullName: string
  photo: string | null
}

export type TReview = {
  id: string
  adId: string
  rating: number
  text: string | null
  type: TReviewType
  createdAt: string
  isAnonymous: boolean
  author: TReviewUserSnippet | null
  target: TReviewUserSnippet
  userState: {
    canEdit: boolean
  }
}

export type TReviewPaginatedResponse = {
  data: TReview[]
  meta: TPaginationMeta
}
