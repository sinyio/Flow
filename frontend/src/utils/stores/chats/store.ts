import type { IChatState, TChatStore } from './types'
import { create } from 'zustand'

import { me } from '@api/auth'
import { getChats, getMessages } from '@api/chats'
import { TChatItem } from '@api/chats/types'

const initialState: IChatState = {
  chats: [],
  selectedChatId: null,
  messages: [],
  activeTab: 'all',
  currentUserId: '',
  isLoading: {
    chats: false,
    messages: false,
    sendMessage: false,
    currentUser: false,
  },
}

export const useChatStore = create<TChatStore>()(set => ({
  ...initialState,

  loadCurrentUser: axiosInstance => {
    set(state => ({ isLoading: { ...state.isLoading, currentUser: true } }))

    return me(axiosInstance)
      .then(res => {
        if ('userId' in res.data) {
          set({ currentUserId: res.data.userId })
        }
      })
      .catch(error => console.error('[ChatStore] me failed:', error))
      .finally(() => set(state => ({ isLoading: { ...state.isLoading, currentUser: false } })))
  },

  loadChats: axiosInstance => {
    set(state => ({ isLoading: { ...state.isLoading, chats: true } }))

    return getChats(undefined, axiosInstance)
      .then(res => {
        set({ chats: res.data.data })
      })
      .catch(error => console.error('[ChatStore] getChats failed:', error))
      .finally(() => set(state => ({ isLoading: { ...state.isLoading, chats: false } })))
  },

  loadMessages: (chatId, axiosInstance) => {
    set(state => ({ isLoading: { ...state.isLoading, messages: true } }))

    return getMessages(chatId, undefined, axiosInstance)
      .then(res => {
        set({ messages: [...res.data.data].reverse() })
      })
      .catch(error => console.error('[ChatStore] getMessages failed:', error))
      .finally(() => set(state => ({ isLoading: { ...state.isLoading, messages: false } })))
  },

  selectChat: chatId => set({ selectedChatId: chatId }),

  clearSelection: () => set({ selectedChatId: null, messages: [] }),

  setTab: tab => set({ activeTab: tab }),

  sendMessage: async (chatId, text, socketSend) => {
    set(state => ({ isLoading: { ...state.isLoading, sendMessage: true } }))

    try {
      const result = await socketSend(chatId, text)

      if (!result.ok) {
        console.error('[ChatStore] sendMessage failed')
      }

      return result.ok
    } finally {
      set(state => ({ isLoading: { ...state.isLoading, sendMessage: false } }))
    }
  },

  addIncomingMessage: message => {
    set(state => {
      if (message.chatId !== state.selectedChatId) return state
      if (state.messages.some(m => m.id === message.id)) return state

      return { messages: [...state.messages, message] }
    })
  },
}))

// Selectors

export const selectFilteredChats = (state: TChatStore): TChatItem[] => {
  switch (state.activeTab) {
    case 'unread':
      return state.chats.filter(chat => (chat.unreadCount ?? 0) > 0)
    case 'myads':
      return state.chats.filter(chat => {
        if (!chat.otherUser) return false

        return chat.otherUser.id !== state.currentUserId
      })
    case 'all':
    default:
      return state.chats
  }
}

export const selectSelectedChat = (state: TChatStore): TChatItem | undefined =>
  state.chats.find(c => c.id === state.selectedChatId)
