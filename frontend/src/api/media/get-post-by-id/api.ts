import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TGetPostByIdRequest, TGetPostByIdResponse } from './types'

export const getPostById = (id: TGetPostByIdRequest, axiosInstance?: AxiosInstance, config?: AxiosRequestConfig) => {
  const { client, url } = resolveApi(`/media/posts/${id}`, axiosInstance)

  return client.get<TGetPostByIdResponse>(url, config)
}
