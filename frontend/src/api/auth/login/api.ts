import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

import { TLoginRequest, TLoginResponse } from './types'

export const login = (
  data: TLoginRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig<TLoginRequest>
) =>
  typeof axiosInstance !== 'undefined'
    ? axiosInstance.post<TLoginResponse>('/auth/login', data, config)
    : axios.post<TLoginResponse>(`${process.env.NEXT_PUBLIC_API_HOST}/auth/login`, data, config)
