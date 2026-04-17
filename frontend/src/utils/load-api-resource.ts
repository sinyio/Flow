import { isAxiosError } from 'axios'
import type { AxiosError, AxiosResponse } from 'axios'
import { notFound, redirect } from 'next/navigation'

import type { IApiError } from '@api/types'

import { isSessionNotFoundInApiMessage, normalizeApiMessage } from './session-not-found'

export type LoadApiResourceResult<T> = { ok: true; data: T } | { ok: false; message: string }

export const DEFAULT_MESSAGE = 'Произошла неизвестная ошибка'

function redirectToAuthIfSessionLost(message: unknown): void {
  if (isSessionNotFoundInApiMessage(message)) {
    redirect('/auth')
  }
}

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

      const data = axiosError.response?.data as IApiError | undefined

      redirectToAuthIfSessionLost(data?.message)

      const message = normalizeApiMessage(data?.message) ?? axiosError.message ?? DEFAULT_MESSAGE

      console.error(error, 'loadApiResource')

      return { ok: false, message: message || DEFAULT_MESSAGE }
    }
    console.error(error, 'loadApiResource')

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

  redirectToAuthIfSessionLost(apiError.message)

  const errorMessage = normalizeApiMessage(apiError.message) ?? apiError.message ?? DEFAULT_MESSAGE

  console.error(apiError, 'loadApiResource')

  return { ok: false, message: errorMessage || DEFAULT_MESSAGE }
}
