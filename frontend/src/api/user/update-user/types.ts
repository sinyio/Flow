import { IApiError } from '@api/types'

export type TUpdateUserRequest = {
  firstName?: string
  lastName?: string
  gender?: string
  dateOfBirth?: string
  contacts?: string
  photo?: File
}

export type TUpdateUserSuccessfullResponse = {
  status: 'ok'
}

export type TUpdateUserResponse = TUpdateUserSuccessfullResponse | IApiError
