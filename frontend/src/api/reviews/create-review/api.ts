import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TCreateReviewRequest, TCreateReviewResponse } from './types'

export const createReview = (
  data: TCreateReviewRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig<TCreateReviewRequest>
) => {
  const { client, url } = resolveApi('/review', axiosInstance)

  return client.post<TCreateReviewResponse>(url, data, config)
}
