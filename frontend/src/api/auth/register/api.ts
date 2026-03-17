import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

import { TRegisterRequest, TRegisterResponse } from './types'

export const register = (
  data: TRegisterRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig<TRegisterRequest>
) =>
  typeof axiosInstance !== 'undefined'
    ? axiosInstance.post<TRegisterResponse>('/auth/register', data)
    : axios.post<TRegisterResponse>(`${process.env.API_HOST}/auth/register`, data, config)
