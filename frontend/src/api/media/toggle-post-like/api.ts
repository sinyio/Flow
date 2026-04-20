import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TTogglePostLikeRequest, TTogglePostLikeResponse } from './types'

export const togglePostLike = (
  id: TTogglePostLikeRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig
) => {
  const { client, url } = resolveApi(`/media/posts/${id}/like`, axiosInstance)

  return client.post<TTogglePostLikeResponse>(url, undefined, config)
}
