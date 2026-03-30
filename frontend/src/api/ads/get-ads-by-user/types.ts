import { IApiError } from '@api/types'

import { TAdPaginatedResponse } from '../types'

export type TGetAdsByUserRequest = {
  userId: string
  page?: number
  limit?: number
}

export type TGetAdsByUserResponse = TAdPaginatedResponse | IApiError
