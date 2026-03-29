import { IApiError } from '@api/types'

export type TPasswordResetRequest = {
  token: string
  password: string
}

export type TPasswordResetSuccessfullResponse = {
  status: 'ok'
  message: string
}

export type TPasswordResetResponse = TPasswordResetSuccessfullResponse | IApiError
