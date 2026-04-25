import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TAcceptRecipientInviteRequest, TAcceptRecipientInviteResponse } from './types'

export const acceptRecipientInvite = (
  token: TAcceptRecipientInviteRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig
) => {
  const { client, url } = resolveApi(`/ads/recipient-invite/${token}`, axiosInstance)

  return client.post<TAcceptRecipientInviteResponse>(url, undefined, config)
}
