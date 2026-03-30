import { TAdDtoRole, TPackaging, TAdsMutationResponse } from '../types'

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
  role: TAdDtoRole
  isFragile: boolean
  isDocument: boolean
  description?: string
  image: File
}

export type TCreateAdResponse = TAdsMutationResponse
