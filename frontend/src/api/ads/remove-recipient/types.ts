import { IApiError, IStatusOk } from '@api/types'

export type TRemoveRecipientRequest = string

export type TRemoveRecipientResponse = IStatusOk | IApiError
