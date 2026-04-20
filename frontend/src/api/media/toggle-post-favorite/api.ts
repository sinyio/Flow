import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TTogglePostFavoriteRequest, TTogglePostFavoriteResponse } from './types'

export const togglePostFavorite = (
  id: TTogglePostFavoriteRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig
) => {
  const { client, url } = resolveApi(`/media/posts/${id}/favorite`, axiosInstance)

  return client.post<TTogglePostFavoriteResponse>(url, undefined, config)
}
