import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

import { TDeleteUserResponse } from './types'

export const deleteUser = (axiosInstance?: AxiosInstance, config?: AxiosRequestConfig) =>
  typeof axiosInstance !== 'undefined'
    ? axiosInstance.delete<TDeleteUserResponse>('/users', config)
    : axios.delete<TDeleteUserResponse>(`${process.env.NEXT_PUBLIC_API_HOST}/users`, config)
