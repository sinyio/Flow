import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TGetReviewsByUserRequest, TGetReviewsByUserResponse } from './types'

export const getReviewsByUser = (
  { userId, page, limit, role }: TGetReviewsByUserRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig
) => {
  const { client, url } = resolveApi(`/review/user/${userId}`, axiosInstance)
  const params = { page, limit, role }

  return client.get<TGetReviewsByUserResponse>(url, { ...config, params })
}
