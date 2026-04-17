import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TDeleteReviewRequest, TDeleteReviewResponse } from './types'

export const deleteReview = (
  id: TDeleteReviewRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig
) => {
  const { client, url } = resolveApi(`/review/${id}`, axiosInstance)

  return client.delete<TDeleteReviewResponse>(url, config)
}
