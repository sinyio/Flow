import { IApiError } from '@api/types'

import { TAd } from '../types'

export type TRoute = {
  fromCity: string
  toCity: string
  totalAds: number
  latestAds: TAd[]
}

export type TGetPopularRoutesResponse = TRoute[] | IApiError
