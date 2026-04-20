import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TCreatePostRequest, TCreatePostResponse } from './types'

const toFormData = (data: TCreatePostRequest) => {
  const form = new FormData()

  if (typeof data.title !== 'undefined') {
    form.append('title', data.title)
  }

  if (typeof data.content !== 'undefined') {
    form.append('content', data.content)
  }

  if (typeof data.image !== 'undefined') {
    form.append('image', data.image)
  }

  return form
}

export const createPost = (
  data: TCreatePostRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig<FormData>
) => {
  const form = toFormData(data)
  const { client, url } = resolveApi('/media/posts', axiosInstance)

  const mergedConfig: AxiosRequestConfig<FormData> = {
    ...config,
    headers: {
      ...(config?.headers ?? {}),
      'Content-Type': 'multipart/form-data',
    },
  }

  return client.post<TCreatePostResponse>(url, form, mergedConfig)
}
