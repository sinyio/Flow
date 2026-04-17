import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TRegisterRequest, TRegisterResponse } from './types'

export const register = (
  data: TRegisterRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig<TRegisterRequest>
) => {
  const { client, url } = resolveApi('/auth/register', axiosInstance)

  return client.post<TRegisterResponse>(url, data, config)
}
