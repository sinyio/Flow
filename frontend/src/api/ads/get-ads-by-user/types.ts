import { IApiError } from '@api/types'

import { TAd, TPaginationMeta } from '../types'

export type TGetAdsByUserRequest = {
  userId: string
  page?: number
  limit?: number
}

export type TGetAdsByUserResponse = { data: TAd[]; meta: TPaginationMeta } | IApiError
