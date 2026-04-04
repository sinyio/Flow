import { IApiError, IStatusOk } from '@api/types'

export type TEmailConfirmationRequest = {
  token: string
}

export type TEmailConfirmationResponse = IStatusOk | IApiError
