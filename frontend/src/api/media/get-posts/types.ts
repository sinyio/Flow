import { IApiError } from '@api/types'

import { TMediaPost, TMediaPostSort, TPaginationMeta } from '../types'

export type TGetPostsParams = {
  page?: number
  limit?: number
  search?: string
  sort?: TMediaPostSort
  authorId?: string
}

export type TGetPostsSuccessResponse = {
  data: TMediaPost[]
  meta: TPaginationMeta
}

export type TGetPostsResponse = TGetPostsSuccessResponse | IApiError
