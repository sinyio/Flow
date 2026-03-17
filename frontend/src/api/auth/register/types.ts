import { IApiError } from '@api/types'

export type TRegisterRequest = {
  email: string
  password: string
}

export type TRegisterSuccessfullResponse = {
  message: string
  status: string
}

export type TRegisterResponse = TRegisterSuccessfullResponse | IApiError
