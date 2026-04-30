export type TPackaging = 'PACKAGE' | 'BOX' | 'ENVELOPE' | 'FILM' | 'NO_PACKAGING' | 'OTHER'

export type TRole = 'sender' | 'recipient' | 'courier' | 'viewer'

export type TStatus = 'ACTIVE' | 'FINISHED'

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
  courierRating?: number
  customerRating?: number
}

export type TAd = {
  id: string
  deletedAt?: string | null
  title: string
  image: string | null
  description: string | null
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
    responseCount: number
    hasResponded: boolean
    chatId: string | null
  }
  author: TUserSnippet
  sender: TUserSnippet | null
  recipient: TUserSnippet | null
  courier: TUserSnippet | null
}
