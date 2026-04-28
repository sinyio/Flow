export type TComplaintType = 'USER' | 'AD' | 'POST'

export interface ICreateComplaintPayload {
  type: TComplaintType
  text: string
  targetUserId?: string
  targetAdId?: string
  targetPostId?: string
}
