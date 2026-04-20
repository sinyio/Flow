import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TCreateCommentRequest, TCreateCommentResponse } from './types'

export const createComment = (
  { id, ...body }: TCreateCommentRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig
) => {
  const { client, url } = resolveApi(`/media/posts/${id}/comments`, axiosInstance)

  return client.post<TCreateCommentResponse>(url, body, config)
}
