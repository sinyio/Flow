import { IApiError, IStatusOk } from '@api/types'

export type TRespondToAdRequest = string

export type TRespondToAdResponse = (IStatusOk & { chatId: string }) | IApiError
