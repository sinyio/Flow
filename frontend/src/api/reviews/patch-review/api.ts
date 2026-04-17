import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TPatchReviewRequest, TPatchReviewResponse } from './types'

export const patchReview = (
  { id, ...body }: TPatchReviewRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig
) => {
  const { client, url } = resolveApi(`/review/${id}`, axiosInstance)

  return client.patch<TPatchReviewResponse>(url, body, config)
}
