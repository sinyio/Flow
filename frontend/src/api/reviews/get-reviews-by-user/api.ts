import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

import { TGetReviewsByUserRequest, TGetReviewsByUserResponse } from './types'

export const getReviewsByUser = (
  { userId, page, limit, role }: TGetReviewsByUserRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig
) => {
  const params = { page, limit, role }

  return typeof axiosInstance !== 'undefined'
    ? axiosInstance.get<TGetReviewsByUserResponse>(`/review/user/${userId}`, { ...config, params })
    : axios.get<TGetReviewsByUserResponse>(
        `${process.env.NEXT_PUBLIC_API_HOST}/review/user/${userId}`,
        {
          ...config,
          params,
        }
      )
}
