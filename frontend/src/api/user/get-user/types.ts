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
  dateOfBirth: string
  gender: 'MALE' | 'FEMALE'
  userState: {
    canEdit: boolean
  }
}

export type TGetUserSuccessfulResponse = TUser

export type TGetUserResponse = TGetUserSuccessfulResponse | IApiError
