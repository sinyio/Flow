import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

import { TDeleteReviewRequest, TDeleteReviewResponse } from './types'

export const deleteReview = (
  id: TDeleteReviewRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig
) =>
  typeof axiosInstance !== 'undefined'
    ? axiosInstance.delete<TDeleteReviewResponse>(`/review/${id}`, config)
    : axios.delete<TDeleteReviewResponse>(`${process.env.NEXT_PUBLIC_API_HOST}/review/${id}`, config)
