import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TLogoutResponse } from './types'

export const logout = (axiosInstance?: AxiosInstance, config?: AxiosRequestConfig) => {
  const { client, url } = resolveApi('/auth/logout', axiosInstance)

  return client.post<TLogoutResponse>(url, undefined, config)
}
