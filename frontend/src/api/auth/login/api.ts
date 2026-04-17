import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TLoginRequest, TLoginResponse } from './types'

export const login = (
  data: TLoginRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig<TLoginRequest>
) => {
  const { client, url } = resolveApi('/auth/login', axiosInstance)

  return client.post<TLoginResponse>(url, data, config)
}
