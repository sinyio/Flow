import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TGetPostsParams, TGetPostsResponse } from './types'

export const getPosts = (params?: TGetPostsParams, axiosInstance?: AxiosInstance, config?: AxiosRequestConfig) => {
  const { client, url } = resolveApi('/media/posts', axiosInstance)

  return client.get<TGetPostsResponse>(url, {
    ...config,
    params: { ...config?.params, ...params },
  })
}
