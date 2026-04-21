import { TMediaComment } from '../types'

export type TCreateCommentRequest = {
  id: string
  text: string
  parentId?: string
}

export type TCreateCommentResponse = {
  status: 'ok'
  comment: TMediaComment
}
