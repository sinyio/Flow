import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TGetAdsByUserRequest, TGetAdsByUserResponse } from './types'

export const getAdsByUser = (
  { userId, page, limit }: TGetAdsByUserRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig
) => {
  const { client, url } = resolveApi(`/ads/user/${userId}`, axiosInstance)
  const params = { page, limit }

  return client.get<TGetAdsByUserResponse>(url, { ...config, params })
}
