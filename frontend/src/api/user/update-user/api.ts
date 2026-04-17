import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

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
  const { client, url } = resolveApi('/users', axiosInstance)

  const mergedConfig: AxiosRequestConfig<FormData> = {
    ...config,
    headers: {
      ...(config?.headers ?? {}),
      'Content-Type': 'multipart/form-data',
    },
  }

  return client.patch<TUpdateUserResponse>(url, form, mergedConfig)
}
