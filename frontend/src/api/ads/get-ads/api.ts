import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TGetAdsParams, TGetAdsResponse } from './types'

export const getAds = (
  params?: TGetAdsParams,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig
) => {
  const { client, url } = resolveApi('/ads', axiosInstance)

  return client.get<TGetAdsResponse>(url, {
    ...config,
    params: { ...config?.params, ...params },
  })
}
