import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TCompleteAdRequest, TCompleteAdResponse } from './types'

export const completeAd = (
  id: TCompleteAdRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig
) => {
  const { client, url } = resolveApi(`/ads/${id}/complete`, axiosInstance)

  return client.patch<TCompleteAdResponse>(url, undefined, config)
}
