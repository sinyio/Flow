import { TMediaMutationResponse } from '../types'

export type TPatchCommentRequest = {
  id: string
  text?: string
}

export type TPatchCommentResponse = TMediaMutationResponse
