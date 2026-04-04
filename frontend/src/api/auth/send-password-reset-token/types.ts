import { IApiError, IStatusOk } from '@api/types'

export type TSendPasswordResetTokenRequest = {
  email: string
}

export type TSendPasswordResetTokenSuccessfullResponse = {
  message: string
} & IStatusOk

export type TSendPasswordResetTokenResponse = TSendPasswordResetTokenSuccessfullResponse | IApiError
