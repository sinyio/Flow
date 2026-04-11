import { IApiError } from '@api/types'

import { TAd, TPaginationMeta } from '../types'

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

export type TGetAdsSuccessfullResponse = {
  data: TAd[]
  meta: TPaginationMeta
}

export type TGetAdsResponse = IApiError | TGetAdsSuccessfullResponse
