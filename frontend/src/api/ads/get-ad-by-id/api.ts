import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TGetAdByIdRequest, TGetAdByIdResponse } from './types'

export const getAdById = (
  id: TGetAdByIdRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig
) => {
  const { client, url } = resolveApi(`/ads/${id}`, axiosInstance)

  return client.get<TGetAdByIdResponse>(url, config)
}
