import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

import { TSendPasswordResetTokenRequest, TSendPasswordResetTokenResponse } from './types'

export const sendPasswordResetToken = (
  data: TSendPasswordResetTokenRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig<TSendPasswordResetTokenRequest>
) =>
  typeof axiosInstance !== 'undefined'
    ? axiosInstance.post<TSendPasswordResetTokenResponse>(
        '/auth/email-confirmation/send-password-reset-token',
        data,
        config
      )
    : axios.post<TSendPasswordResetTokenResponse>(
        `${process.env.NEXT_PUBLIC_API_HOST}/auth/email-confirmation/send-password-reset-token`,
        data,
        config
      )
