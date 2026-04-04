import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

import { TGetAdsParams, TGetAdsResponse } from './types'

export const getAds = (
  params?: TGetAdsParams,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig
) =>
  typeof axiosInstance !== 'undefined'
    ? axiosInstance.get<TGetAdsResponse>('/ads', {
        ...config,
        params: { ...config?.params, ...params },
      })
    : axios.get<TGetAdsResponse>(`${process.env.NEXT_PUBLIC_API_HOST}/ads`, {
        ...config,
        params: { ...config?.params, ...params },
      })
