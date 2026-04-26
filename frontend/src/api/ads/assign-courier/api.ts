import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TAssignCourierRequest, TAssignCourierResponse } from './types'

export const assignCourier = (
  { adId, courierId }: TAssignCourierRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig
) => {
  const { client, url } = resolveApi(`/ads/${adId}/assign-courier`, axiosInstance)

  return client.post<TAssignCourierResponse>(url, { courierId }, config)
}
