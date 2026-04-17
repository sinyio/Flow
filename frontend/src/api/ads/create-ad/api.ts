import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'
import { toIso } from '@api/utils'

import { TCreateAdRequest, TCreateAdResponse } from './types'

const toFormData = (data: TCreateAdRequest) => {
  const form = new FormData()

  form.append('title', data.title)
  form.append('startDate', toIso(data.startDate))
  form.append('endDate', toIso(data.endDate))
  form.append('fromCity', data.fromCity)
  form.append('toCity', data.toCity)
  form.append('weight', String(data.weight))
  form.append('length', String(data.length))
  form.append('width', String(data.width))
  form.append('height', String(data.height))
  form.append('price', String(data.price))
  form.append('packaging', data.packaging)
  form.append('role', data.role)
  form.append('isFragile', String(data.isFragile))
  form.append('isDocument', String(data.isDocument))

  if (typeof data.description !== 'undefined') {
    form.append('description', data.description)
  }

  form.append('image', data.image)

  return form
}

export const createAd = (
  data: TCreateAdRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig<FormData>
) => {
  const form = toFormData(data)
  const { client, url } = resolveApi('/ads', axiosInstance)

  const mergedConfig: AxiosRequestConfig<FormData> = {
    ...config,
    headers: {
      ...(config?.headers ?? {}),
      'Content-Type': 'multipart/form-data',
    },
  }

  return client.post<TCreateAdResponse>(url, form, mergedConfig)
}
