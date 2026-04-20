import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TAddPostViewRequest, TAddPostViewResponse } from './types'

export const addPostView = (id: TAddPostViewRequest, axiosInstance?: AxiosInstance, config?: AxiosRequestConfig) => {
  const { client, url } = resolveApi(`/media/posts/${id}/view`, axiosInstance)

  return client.post<TAddPostViewResponse>(url, undefined, config)
}
