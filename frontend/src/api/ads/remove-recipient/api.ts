import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TRemoveRecipientRequest, TRemoveRecipientResponse } from './types'

export const removeRecipient = (
  id: TRemoveRecipientRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig
) => {
  const { client, url } = resolveApi(`/ads/${id}/recipient`, axiosInstance)

  return client.delete<TRemoveRecipientResponse>(url, config)
}
