import { IApiError, IStatusOk } from '@api/types'

export type TCreatePostRequest = {
  title?: string
  content?: string
  image?: File
}

export type TCreatePostResponse = (IStatusOk & { id: string }) | IApiError
