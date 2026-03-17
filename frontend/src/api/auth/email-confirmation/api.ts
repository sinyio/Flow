import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

import { TEmailConfirmationRequest, TEmailConfirmationResponse } from './types'

export const emailConfirmation = (
  data: TEmailConfirmationRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig<TEmailConfirmationRequest>
) =>
  typeof axiosInstance !== 'undefined'
    ? axiosInstance.post<TEmailConfirmationResponse>('/auth/email-confirmation', data, config)
    : axios.post<TEmailConfirmationResponse>(
        `${process.env.API_HOST}/auth/email-confirmation`,
        data,
        config
      )
