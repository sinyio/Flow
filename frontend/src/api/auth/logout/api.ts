import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

import { TLogoutResponse } from './types'

export const logout = (axiosInstance?: AxiosInstance, config?: AxiosRequestConfig) =>
  typeof axiosInstance !== 'undefined'
    ? axiosInstance.post<TLogoutResponse>('/auth/logout', undefined, config)
    : axios.post<TLogoutResponse>(
        `${process.env.NEXT_PUBLIC_API_HOST}/auth/logout`,
        undefined,
        config
      )
