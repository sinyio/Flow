import { IApiError } from '@api/types'

export type TGetUserRequest = string

export type TUser = {
  id: string
  firstName: string
  lastName: string
  photo: string
  registeredAt: string
  successfulDeliveriesCount: number
  authoredAdsCount: number
  receivedReviewsCount: number
  authoredReviewsCount: number
  userState: {
    canEdit: boolean
  }
}

export type TGetUserSuccessfullResponse = TUser

export type TGetUserResponse = TGetUserSuccessfullResponse | IApiError
