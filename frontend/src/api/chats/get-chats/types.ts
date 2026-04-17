import { TChatItem, TPaginationMeta } from '../types'

export type TGetChatsParams = {
  page?: number
  limit?: number
  q?: string
}

export type TGetChatsResponse = {
  data: TChatItem[]
  meta: TPaginationMeta
}
