import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

import { TCreateReviewRequest, TCreateReviewResponse } from './types'

export const createReview = (
  data: TCreateReviewRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig<TCreateReviewRequest>
) =>
  typeof axiosInstance !== 'undefined'
    ? axiosInstance.post<TCreateReviewResponse>('/review', data, config)
    : axios.post<TCreateReviewResponse>(`${process.env.NEXT_PUBLIC_API_HOST}/review`, data, config)
