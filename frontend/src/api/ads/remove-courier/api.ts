import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TRemoveCourierRequest, TRemoveCourierResponse } from './types'

export const removeCourier = (
  id: TRemoveCourierRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig
) => {
  const { client, url } = resolveApi(`/ads/${id}/courier`, axiosInstance)

  return client.delete<TRemoveCourierResponse>(url, config)
}
