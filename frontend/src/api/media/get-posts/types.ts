import { IApiError } from '@api/types'

import { TPost, TMediaPostSort, TPaginationMeta } from '../types'

export type TGetPostsParams = {
  page?: number
  limit?: number
  search?: string
  sort?: TMediaPostSort
  authorId?: string
}

export type TGetPostsSuccessResponse = {
  data: TPost[]
  meta: TPaginationMeta
}

export type TGetPostsResponse = TGetPostsSuccessResponse | IApiError
