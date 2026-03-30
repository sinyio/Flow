import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

import { TGetReviewByIdRequest, TGetReviewByIdResponse } from './types'

export const getReviewById = (
  id: TGetReviewByIdRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig
) =>
  typeof axiosInstance !== 'undefined'
    ? axiosInstance.get<TGetReviewByIdResponse>(`/review/${id}`, config)
    : axios.get<TGetReviewByIdResponse>(`${process.env.NEXT_PUBLIC_API_HOST}/review/${id}`, config)
