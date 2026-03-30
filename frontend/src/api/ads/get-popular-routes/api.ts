import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

import { TGetPopularRoutesResponse } from './types'

export const getPopularRoutes = (axiosInstance?: AxiosInstance, config?: AxiosRequestConfig) =>
  typeof axiosInstance !== 'undefined'
    ? axiosInstance.get<TGetPopularRoutesResponse>('/ads/popular-routes', config)
    : axios.get<TGetPopularRoutesResponse>(
        `${process.env.NEXT_PUBLIC_API_HOST}/ads/popular-routes`,
        config
      )
