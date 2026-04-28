export type TComplaintType = 'USER' | 'AD' | 'POST'

export interface ICreateComplaintPayload {
  type: TComplaintType
  text: string
  targetUserId?: string
  targetAdId?: string
  targetPostId?: string
}

export interface TComplaintUser {
  id: string
  firstName: string | null
  lastName: string | null
  photo: string | null
}

export interface TComplaint {
  id: string
  type: TComplaintType
  text: string
  author: TComplaintUser
  targetUser: TComplaintUser | null
  targetAd: { id: string; title: string } | null
  targetPost: { id: string; title: string } | null
  createdAt: string
}

export interface TComplaintsResponse {
  data: TComplaint[]
  total: number
  page: number
  limit: number
}
