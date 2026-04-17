import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TEmailConfirmationRequest, TEmailConfirmationResponse } from './types'

export const emailConfirmation = (
  data: TEmailConfirmationRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig<TEmailConfirmationRequest>
) => {
  const { client, url } = resolveApi('/auth/email-confirmation', axiosInstance)

  return client.post<TEmailConfirmationResponse>(url, data, config)
}
