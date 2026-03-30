import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

import { TDeleteAdRequest, TDeleteAdResponse } from './types'

export const deleteAd = (
  id: TDeleteAdRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig
) =>
  typeof axiosInstance !== 'undefined'
    ? axiosInstance.delete<TDeleteAdResponse>(`/ads/${id}`, config)
    : axios.delete<TDeleteAdResponse>(`${process.env.NEXT_PUBLIC_API_HOST}/ads/${id}`, config)
