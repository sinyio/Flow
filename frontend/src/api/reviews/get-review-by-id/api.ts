import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TGetReviewByIdRequest, TGetReviewByIdResponse } from './types'

export const getReviewById = (
  id: TGetReviewByIdRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig
) => {
  const { client, url } = resolveApi(`/review/${id}`, axiosInstance)

  return client.get<TGetReviewByIdResponse>(url, config)
}
