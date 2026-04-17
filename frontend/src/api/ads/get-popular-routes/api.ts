import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TGetPopularRoutesResponse } from './types'

export const getPopularRoutes = (axiosInstance?: AxiosInstance, config?: AxiosRequestConfig) => {
  const { client, url } = resolveApi('/ads/popular-routes', axiosInstance)

  return client.get<TGetPopularRoutesResponse>(url, config)
}
