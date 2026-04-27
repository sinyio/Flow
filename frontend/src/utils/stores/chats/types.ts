import type { AxiosInstance } from 'axios'

import { TChatItem, TMessage } from '@api/chats/types'

export type TChatTab = 'all' | 'unread' | 'myads'

export interface IChatState {
  chats: TChatItem[]
  selectedChatId: string | null
  messages: TMessage[]
  activeTab: TChatTab
  currentUserId: string
  isLoading: {
    chats: boolean
    messages: boolean
    sendMessage: boolean
    currentUser: boolean
  }
}

export interface IChatActions {
  loadCurrentUser: (axiosInstance: AxiosInstance) => Promise<void>

  loadChats: (axiosInstance: AxiosInstance) => Promise<void>

  loadMessages: (chatId: string, axiosInstance: AxiosInstance) => Promise<void>

  selectChat: (chatId: string) => void

  clearSelection: () => void

  setTab: (tab: TChatTab) => void

  sendMessage: (
    chatId: string,
    text: string,
    socketSend: (chatId: string, text: string) => Promise<{ ok: boolean }>
  ) => Promise<boolean>

  addIncomingMessage: (message: TMessage) => void

  setCanAssignCourier: (chatId: string, value: boolean) => void
}

export type TChatStore = IChatState & IChatActions
