import { TMessage, TPaginationMeta } from '../types'

export type TGetMessagesParams = {
  page?: number
  limit?: number
}

export type TGetMessagesResponse = {
  data: TMessage[]
  meta: TPaginationMeta
}
