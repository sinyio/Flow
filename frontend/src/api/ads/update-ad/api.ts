import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { resolveApi } from '@api/client'
import { toIso } from '@api/utils'

import { TUpdateAdRequest, TUpdateAdResponse } from './types'

const toFormData = (data: Omit<TUpdateAdRequest, 'id'>) => {
  const form = new FormData()

  const appendIf = (key: string, value: string | Blob | boolean | number | undefined) => {
    if (typeof value === 'undefined') return
    if (value instanceof Blob) {
      form.append(key, value)

      return
    }
    form.append(key, String(value))
  }

  appendIf('title', data.title)
  if (typeof data.startDate !== 'undefined') appendIf('startDate', toIso(data.startDate))
  if (typeof data.endDate !== 'undefined') appendIf('endDate', toIso(data.endDate))
  appendIf('fromCity', data.fromCity)
  appendIf('toCity', data.toCity)
  if (typeof data.weight !== 'undefined') appendIf('weight', data.weight)
  if (typeof data.length !== 'undefined') appendIf('length', data.length)
  if (typeof data.width !== 'undefined') appendIf('width', data.width)
  if (typeof data.height !== 'undefined') appendIf('height', data.height)
  if (typeof data.price !== 'undefined') appendIf('price', data.price)
  appendIf('packaging', data.packaging)
  appendIf('role', data.role)
  if (typeof data.isFragile !== 'undefined') appendIf('isFragile', data.isFragile)
  if (typeof data.isDocument !== 'undefined') appendIf('isDocument', data.isDocument)
  appendIf('description', data.description)
  if (typeof data.image !== 'undefined') form.append('image', data.image)

  return form
}

export const updateAd = (
  data: TUpdateAdRequest,
  axiosInstance?: AxiosInstance,
  config?: AxiosRequestConfig<FormData>
) => {
  const { id, ...rest } = data
  const form = toFormData(rest)
  const { client, url } = resolveApi(`/ads/${id}`, axiosInstance)

  const mergedConfig: AxiosRequestConfig<FormData> = {
    ...config,
    headers: {
      ...(config?.headers ?? {}),
      'Content-Type': 'multipart/form-data',
    },
  }

  return client.patch<TUpdateAdResponse>(url, form, mergedConfig)
}
