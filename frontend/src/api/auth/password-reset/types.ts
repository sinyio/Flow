import { IApiError, IStatusOk } from '@api/types'

export type TPasswordResetRequest = {
  token: string
  password: string
}

export type TPasswordResetSuccessfullResponse = {
  message: string
} & IStatusOk

export type TPasswordResetResponse = TPasswordResetSuccessfullResponse | IApiError
