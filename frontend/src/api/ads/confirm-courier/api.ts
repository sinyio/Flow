import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TConfirmCourierRequest, TConfirmCourierResponse } from './types'

export const confirmCourier = (
  { adId }: TConfirmCourierRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig
) => {
  const { client, url } = resolveApi(`/ads/${adId}/confirm-courier`, axiosInstance)

  return client.post<TConfirmCourierResponse>(url, {}, config)
}
