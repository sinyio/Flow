import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TGetChatsParams, TGetChatsResponse } from './types'

export const getChats = (
  params?: TGetChatsParams,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig
) => {
  const { client, url } = resolveApi('/chats', axiosInstance)

  return client.get<TGetChatsResponse>(url, {
    ...config,
    params: { ...config?.params, ...params },
  })
}
