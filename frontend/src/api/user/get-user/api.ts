import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TGetUserRequest, TGetUserResponse } from './types'

export const getUser = (
  uuid: TGetUserRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig
) => {
  const { client, url } = resolveApi(`/users/${uuid}`, axiosInstance)

  return client.get<TGetUserResponse>(url, config)
}
