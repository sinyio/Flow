import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TGenerateRecipientInviteRequest, TGenerateRecipientInviteResponse } from './types'

export const generateRecipientInvite = (
  id: TGenerateRecipientInviteRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig
) => {
  const { client, url } = resolveApi(`/ads/${id}/recipient-invite`, axiosInstance)

  return client.post<TGenerateRecipientInviteResponse>(url, undefined, config)
}
