import { IApiError } from '@api/types'

export type TLoginRequest = {
  email: string
  password: string
}

export type TLoginSuccessResponse = {
  userId: string
}

export type TLoginResponse = TLoginSuccessResponse | IApiError
