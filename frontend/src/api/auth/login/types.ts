import { IApiError, IStatusOk } from '@api/types'

export type TLoginRequest = {
  email: string
  password: string
}

export type TLoginResponse = IStatusOk | IApiError
