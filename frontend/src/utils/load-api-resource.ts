import { notFound } from 'next/navigation'
import { isAxiosError } from 'axios'
import type { AxiosError, AxiosResponse } from 'axios'
import type { IApiError } from '@api/types'

export type LoadApiResourceResult<T> = { ok: true; data: T } | { ok: false; message: string }

export const DEFAULT_MESSAGE = 'Произошла неизвестная ошибка'

export const loadApiResource = async <T>(
  fetcher: () => Promise<AxiosResponse<T | IApiError>>,
  isSuccess: (data: T | IApiError) => data is T
): Promise<LoadApiResourceResult<T>> => {
  let response: AxiosResponse<T | IApiError>

  try {
    response = await fetcher()
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError<IApiError>

      if (axiosError.response?.status === 404) {
        notFound()
      }

      const message = axiosError.response?.data?.message ?? axiosError.message

      return { ok: false, message: message || DEFAULT_MESSAGE }
    }

    return {
      ok: false,
      message: error instanceof Error ? error.message : DEFAULT_MESSAGE,
    }
  }

  const data = response.data

  if (isSuccess(data)) {
    return { ok: true, data }
  }

  const apiError = data as IApiError

  if (apiError.statusCode === 404) {
    notFound()
  }

  return { ok: false, message: apiError.message || DEFAULT_MESSAGE }
}
