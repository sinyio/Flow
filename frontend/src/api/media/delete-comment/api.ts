import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TDeleteCommentRequest, TDeleteCommentResponse } from './types'

export const deleteComment = (
  id: TDeleteCommentRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig
) => {
  const { client, url } = resolveApi(`/media/comments/${id}`, axiosInstance)

  return client.delete<TDeleteCommentResponse>(url, config)
}
