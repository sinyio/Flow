import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TDeletePostRequest, TDeletePostResponse } from './types'

export const deletePost = (id: TDeletePostRequest, axiosInstance?: AxiosInstance, config?: AxiosRequestConfig) => {
  const { client, url } = resolveApi(`/media/posts/${id}`, axiosInstance)

  return client.delete<TDeletePostResponse>(url, config)
}
