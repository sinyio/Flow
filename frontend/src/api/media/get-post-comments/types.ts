import { IApiError } from '@api/types'

import { TMediaComment, TPaginationMeta } from '../types'

export type TGetPostCommentsRequest = {
  id: string
  page?: number
  limit?: number
}

export type TGetPostCommentsSuccessResponse = {
  data: TMediaComment[]
  meta: TPaginationMeta
}

export type TGetPostCommentsResponse = TGetPostCommentsSuccessResponse | IApiError
