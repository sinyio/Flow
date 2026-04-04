import { IApiError, IStatusOk } from '@api/types'

export type TUpdateUserRequest = {
  firstName?: string
  lastName?: string
  gender?: string
  dateOfBirth?: string
  contacts?: string
  photo?: File
}

export type TUpdateUserResponse = IStatusOk | IApiError
