import { TMediaMutationResponse } from '../types'

export type TCreatePostRequest = {
  title?: string
  content?: string
  image?: File
}

export type TCreatePostResponse = TMediaMutationResponse
