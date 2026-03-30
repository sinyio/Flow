import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

import { TGetAdByIdRequest, TGetAdByIdResponse } from './types'

export const getAdById = (
  id: TGetAdByIdRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig
) =>
  typeof axiosInstance !== 'undefined'
    ? axiosInstance.get<TGetAdByIdResponse>(`/ads/${id}`, config)
    : axios.get<TGetAdByIdResponse>(`${process.env.NEXT_PUBLIC_API_HOST}/ads/${id}`, config)
