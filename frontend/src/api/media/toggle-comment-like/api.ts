import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TToggleCommentLikeRequest, TToggleCommentLikeResponse } from './types'

export const toggleCommentLike = (
  id: TToggleCommentLikeRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig
) => {
  const { client, url } = resolveApi(`/media/comments/${id}/like`, axiosInstance)

  return client.post<TToggleCommentLikeResponse>(url, undefined, config)
}
