import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TPasswordResetRequest, TPasswordResetResponse } from './types'

export const passwordReset = (
  data: TPasswordResetRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig<TPasswordResetRequest>
) => {
  const { client, url } = resolveApi('/auth/email-confirmation/password-reset', axiosInstance)

  return client.post<TPasswordResetResponse>(url, data, config)
}
