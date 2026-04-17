import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TDeleteAdRequest, TDeleteAdResponse } from './types'

export const deleteAd = (
  id: TDeleteAdRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig
) => {
  const { client, url } = resolveApi(`/ads/${id}`, axiosInstance)

  return client.delete<TDeleteAdResponse>(url, config)
}
