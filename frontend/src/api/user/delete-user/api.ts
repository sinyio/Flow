import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TDeleteUserResponse } from './types'

export const deleteUser = (axiosInstance?: AxiosInstance, config?: AxiosRequestConfig) => {
  const { client, url } = resolveApi('/users', axiosInstance)

  return client.delete<TDeleteUserResponse>(url, config)
}
