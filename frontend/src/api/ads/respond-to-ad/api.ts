import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

import { TRespondToAdRequest, TRespondToAdResponse } from './types'

export const respondToAd = (
  id: TRespondToAdRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig
) =>
  typeof axiosInstance !== 'undefined'
    ? axiosInstance.post<TRespondToAdResponse>(`/ads/${id}/respond`, undefined, config)
    : axios.post<TRespondToAdResponse>(
        `${process.env.NEXT_PUBLIC_API_HOST}/ads/${id}/respond`,
        undefined,
        config
      )
