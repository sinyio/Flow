import { IApiError } from '@api/types'

export type TGenerateRecipientInviteRequest = string

export type TGenerateRecipientInviteResponse = { token: string } | IApiError
