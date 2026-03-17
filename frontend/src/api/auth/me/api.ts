import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

import { TMeResponse } from './types'

export const me = (axiosInstance?: AxiosInstance, config?: AxiosRequestConfig) =>
  typeof axiosInstance !== 'undefined'
    ? axiosInstance.get<TMeResponse>('/auth/me', config)
    : axios.get<TMeResponse>(`${process.env.HTTP_HOST}/auth/me`, config)
