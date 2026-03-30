import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

import { TGetAdsByUserRequest, TGetAdsByUserResponse } from './types'

export const getAdsByUser = (
  { userId, page, limit }: TGetAdsByUserRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig
) => {
  const params = { page, limit }

  return typeof axiosInstance !== 'undefined'
    ? axiosInstance.get<TGetAdsByUserResponse>(`/ads/user/${userId}`, { ...config, params })
    : axios.get<TGetAdsByUserResponse>(`${process.env.NEXT_PUBLIC_API_HOST}/ads/user/${userId}`, {
        ...config,
        params,
      })
}
