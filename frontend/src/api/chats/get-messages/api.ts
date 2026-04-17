import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TGetMessagesParams, TGetMessagesResponse } from './types'

export const getMessages = (
  chatId: string,
  params?: TGetMessagesParams,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig
) => {
  const { client, url } = resolveApi(`/chats/${chatId}/messages`, axiosInstance)

  return client.get<TGetMessagesResponse>(url, {
    ...config,
    params: { ...config?.params, ...params },
  })
}
