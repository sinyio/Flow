import { IApiError } from '@api/types'

export type TSendPasswordResetTokenRequest = {
  email: string
}

export type TSendPasswordResetTokenSuccessfullResponse = {
  status: 'ok'
  message: string
}

export type TSendPasswordResetTokenResponse = TSendPasswordResetTokenSuccessfullResponse | IApiError
