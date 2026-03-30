import { IApiError } from '@api/types'

export type TAdsStatusOk = {
  status: 'ok'
}

export type TAdsMutationResponse = TAdsStatusOk | IApiError

export type TPaginationMeta = {
  page: number
  limit: number
  total: number
  pages: number
}

export type TUserSnippet = {
  id: string
  fullName: string
  photo: string | null
  deletedAt?: string | null
}

export type TViewerRole = 'viewer' | 'sender' | 'recipient'

export type TPackaging = 'PACKAGE' | 'BOX' | 'ENVELOPE' | 'FILM' | 'NO_PACKAGING' | 'OTHER'

export type TRole = 'sender' | 'recipient'

// DTO role used in ads mutations (create/update)
export type TAdDtoRole = TRole

export type TStatus = 'ACTIVE' | 'FINISHED'

export type TAd = {
  id: string
  deletedAt?: string | null
  title: string
  image: string | null
  description: string
  status: TStatus
  startDate: string
  endDate: string
  fromCity: string
  toCity: string
  price: number
  weight: number
  isFragile: boolean
  isDocument: boolean
  packaging: TPackaging
  length: number
  width: number
  height: number
  userState: {
    canEdit: boolean
    role: TRole
  }
  author: TUserSnippet
  sender: TUserSnippet | null
  recipient: TUserSnippet | null
  courier: TUserSnippet | null
}

export type TAdPaginatedResponse = {
  data: TAd[]
  meta: TPaginationMeta
}

export type TPopularRoutesResponse = Array<{
  fromCity: string
  toCity: string
  totalAds: number
  latestAds: TAd[]
}>
