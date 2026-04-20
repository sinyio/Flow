import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'

import { TPatchPostRequest, TPatchPostResponse } from './types'

const toFormData = (data: Omit<TPatchPostRequest, 'id'>) => {
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

export const patchPost = (
  { id, ...body }: TPatchPostRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig<FormData>
) => {
  const form = toFormData(body)
  const { client, url } = resolveApi(`/media/posts/${id}`, axiosInstance)

  const mergedConfig: AxiosRequestConfig<FormData> = {
    ...config,
    headers: {
      ...(config?.headers ?? {}),
      'Content-Type': 'multipart/form-data',
    },
  }

  return client.patch<TPatchPostResponse>(url, form, mergedConfig)
}
