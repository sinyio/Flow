import { IApiError, IStatusOk } from '@api/types'
import { TPaginationMeta } from '@api/ads/types'

export type { TPaginationMeta }

export type TMediaPostSort = 'newest' | 'oldest' | 'relevant'

export type TMediaMutationResponse = IStatusOk | IApiError

export type TMediaUserSnippet = {
  id: string
  fullName: string
  photo: string | null
  deletedAt?: string | null
}

export type TMediaComment = {
  id: string
  text: string
  createdAt: string
  likesCount: number
  author: TMediaUserSnippet | null
  parentId: string | null
  isLiked: boolean
  replies: TMediaComment[]
}

export type TMediaPost = {
  id: string
  title: string
  content?: string
  image: string | null
  createdAt: string
  updatedAt?: string
  author: TMediaUserSnippet | null
  viewsCount: number
  likesCount: number
  favoritesCount: number
  commentsCount: number
  isLiked: boolean
  isFavorite: boolean
}
