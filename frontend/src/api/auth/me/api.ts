import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TMeResponse } from './types'

export const me = (axiosInstance?: AxiosInstance, config?: AxiosRequestConfig) => {
  const { client, url } = resolveApi('/auth/me', axiosInstance)

  return client.get<TMeResponse>(url, config)
}
