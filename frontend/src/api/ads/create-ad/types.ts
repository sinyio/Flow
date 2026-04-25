import { IApiError, IStatusOk } from '@api/types'

import { TAd, TPackaging } from '../types'

export type TCreateAdRequest = {
  title: string
  startDate: string | Date
  endDate: string | Date
  fromCity: string
  toCity: string
  weight: number
  length: number
  width: number
  height: number
  price: number
  packaging: TPackaging
  role: TAd['userState']['role']
  isFragile: boolean
  isDocument: boolean
  description?: string
  image: File
}

export type TCreateAdResponse = (IStatusOk & { id: string }) | IApiError
