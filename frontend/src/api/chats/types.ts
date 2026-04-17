import { TPaginationMeta } from '@api/ads/types'

export type { TPaginationMeta }

export type TChatAd = {
  id: string
  title: string
  status: string
  image: string | null
}

export type TChatUserSnippet = {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  photo: string | null
}

export type TChatLastMessage = {
  id: string
  text: string | null
  createdAt: string
  senderId: string
  filesCount: number
}

export type TChatItem = {
  id: string
  adId: string
  responseId: string | null
  createdAt: string
  updatedAt: string
  ad: TChatAd
  otherUser: TChatUserSnippet | null
  lastMessage: TChatLastMessage | null
}

export type TMessageFile = {
  id: string
  url: string
  mimeType: string
  fileName: string | null
  size: number
  createdAt: string
}

export type TMessage = {
  id: string
  chatId: string
  text: string | null
  createdAt: string
  sender: TChatUserSnippet
  files: TMessageFile[]
}
