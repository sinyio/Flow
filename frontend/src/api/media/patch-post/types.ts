import { TMediaMutationResponse } from '../types'

export type TPatchPostRequest = {
  id: string
  title?: string
  content?: string
  image?: File
}

export type TPatchPostResponse = TMediaMutationResponse
