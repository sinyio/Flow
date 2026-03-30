import { IApiError } from '@api/types'

import { TAdPaginatedResponse } from '../types'

export type TGetAdsParams = {
  page?: number
  limit?: number
  isDocument?: boolean
  isFragile?: boolean
  maxWeight?: number
  minPrice?: number
  fromCity?: string
  toCity?: string
  startDate?: string
  endDate?: string
}

export type TGetAdsResponse = TAdPaginatedResponse | IApiError
