import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

import { TPasswordResetRequest, TPasswordResetResponse } from './types'

export const passwordReset = (
  data: TPasswordResetRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig<TPasswordResetRequest>
) =>
  typeof axiosInstance !== 'undefined'
    ? axiosInstance.post<TPasswordResetResponse>(
        '/auth/email-confirmation/password-reset',
        data,
        config
      )
    : axios.post<TPasswordResetResponse>(
        `${process.env.NEXT_PUBLIC_API_HOST}/auth/email-confirmation/password-reset`,
        data,
        config
      )
