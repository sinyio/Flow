import { IApiError, IStatusOk } from '@api/types'

export type TReviewsMutationResponse = IStatusOk | IApiError

export type TReviewType = 'CUSTOMER_TO_COURIER' | 'COURIER_TO_CUSTOMER'

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
