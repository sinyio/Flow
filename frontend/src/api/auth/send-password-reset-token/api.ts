import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TSendPasswordResetTokenRequest, TSendPasswordResetTokenResponse } from './types'

export const sendPasswordResetToken = (
  data: TSendPasswordResetTokenRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig<TSendPasswordResetTokenRequest>
) => {
  const { client, url } = resolveApi(
    '/auth/email-confirmation/send-password-reset-token',
    axiosInstance
  )

  return client.post<TSendPasswordResetTokenResponse>(url, data, config)
}
