import { IApiError } from '@api/types'

export type TEmailConfirmationRequest = {
  token: string
}

export type TEmailConfirmationSuccessfullResponse = {
  status: 'ok'
}

export type TEmailConfirmationResponse = TEmailConfirmationSuccessfullResponse | IApiError
