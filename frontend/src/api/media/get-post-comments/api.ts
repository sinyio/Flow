import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TGetPostCommentsRequest, TGetPostCommentsResponse } from './types'

export const getPostComments = (
  { id, ...params }: TGetPostCommentsRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig
) => {
  const { client, url } = resolveApi(`/media/posts/${id}/comments`, axiosInstance)

  return client.get<TGetPostCommentsResponse>(url, {
    ...config,
    params: { ...config?.params, ...params },
  })
}
