import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

import { TUpdateUserRequest, TUpdateUserResponse } from './types'

const toFormData = (data: TUpdateUserRequest) => {
  const form = new FormData()

  const formFields = [
    'firstName',
    'lastName',
    'gender',
    'dateOfBirth',
    'contacts',
    'photo',
  ] as const

  formFields.forEach(key => {
    const value = data[key]

    if (typeof value !== 'undefined') form.append(key, value)
  })

  return form
}

export const updateUser = (
  data: TUpdateUserRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig<FormData>
) => {
  const form = toFormData(data)

  const mergedConfig: AxiosRequestConfig<FormData> = {
    ...config,
    headers: {
      ...(config?.headers ?? {}),
      'Content-Type': 'multipart/form-data',
    },
  }

  return typeof axiosInstance !== 'undefined'
    ? axiosInstance.patch<TUpdateUserResponse>('/users', form, mergedConfig)
    : axios.patch<TUpdateUserResponse>(
        `${process.env.NEXT_PUBLIC_API_HOST}/users`,
        form,
        mergedConfig
      )
}
