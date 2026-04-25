import { IApiError, IStatusOk } from '@api/types'

export type TAcceptRecipientInviteRequest = string

export type TAcceptRecipientInviteResponse = (IStatusOk & { adId: string }) | IApiError
