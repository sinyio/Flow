import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

import { TPatchReviewRequest, TPatchReviewResponse } from './types'

export const patchReview = (
  { id, ...body }: TPatchReviewRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig
) =>
  typeof axiosInstance !== 'undefined'
    ? axiosInstance.patch<TPatchReviewResponse>(`/review/${id}`, body, config)
    : axios.patch<TPatchReviewResponse>(
        `${process.env.NEXT_PUBLIC_API_HOST}/review/${id}`,
        body,
        config
      )
