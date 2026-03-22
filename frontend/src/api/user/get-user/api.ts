import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

import { TGetUserRequest, TGetUserResponse } from './types'

export const getUser = (
  uuid: TGetUserRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig<TGetUserRequest>
) =>
  typeof axiosInstance !== 'undefined'
    ? axiosInstance.get<TGetUserResponse>(`/users/${uuid}`, config)
    : axios.get<TGetUserResponse>(`${process.env.NEXT_PUBLIC_API_HOST}/users/${uuid}`, config)
