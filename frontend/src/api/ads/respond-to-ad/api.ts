import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TRespondToAdRequest, TRespondToAdResponse } from './types'

export const respondToAd = (
  id: TRespondToAdRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig
) => {
  const { client, url } = resolveApi(`/ads/${id}/respond`, axiosInstance)

  return client.post<TRespondToAdResponse>(url, undefined, config)
}
