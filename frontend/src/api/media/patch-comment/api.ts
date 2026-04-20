import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TPatchCommentRequest, TPatchCommentResponse } from './types'

export const patchComment = (
  { id, ...body }: TPatchCommentRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig
) => {
  const { client, url } = resolveApi(`/media/comments/${id}`, axiosInstance)

  return client.patch<TPatchCommentResponse>(url, body, config)
}
