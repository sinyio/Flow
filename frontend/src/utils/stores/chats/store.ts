import type { IChatState, TChatStore } from './types'
import { create } from 'zustand'

import { getChats, getMessages } from '@api/chats'
import { useCurrentUserStore } from '@utils/stores/current-user'
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

    return useCurrentUserStore.getState().fetch(axiosInstance)
      .then(userId => {
        if (userId) set({ currentUserId: userId })
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
        set({ messages: res.data.data })
      })
      .catch(error => console.error('[ChatStore] getMessages failed:', error))
      .finally(() => set(state => ({ isLoading: { ...state.isLoading, messages: false } })))
  },

  selectChat: chatId => set(state => ({
    selectedChatId: chatId,
    chats: state.chats.map(chat =>
      chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
    ),
  })),

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

      const updatedChats = state.chats.map(chat =>
        chat.id === message.chatId
          ? {
              ...chat,
              lastMessage: {
                id: message.id,
                text: message.text,
                createdAt: message.createdAt,
                senderId: message.sender.id,
                filesCount: message.files.length,
              },
              updatedAt: message.createdAt,
            }
          : chat
      )

      return { messages: [...state.messages, message], chats: updatedChats }
    })
  },

  handleChatActivity: (chatId, message) => {
    set(state => {
      if (chatId === state.selectedChatId) return state

      const updatedChats = state.chats
        .map(chat =>
          chat.id === chatId
            ? {
                ...chat,
                unreadCount: (chat.unreadCount ?? 0) + 1,
                lastMessage: {
                  id: message.id,
                  text: message.text,
                  createdAt: message.createdAt,
                  senderId: message.sender.id,
                  filesCount: message.files.length,
                },
                updatedAt: message.createdAt,
              }
            : chat
        )
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

      return { chats: updatedChats }
    })
  },

  setCanAssignCourier: (chatId, value) => {
    set(state => ({
      chats: state.chats.map(chat =>
        chat.id === chatId ? { ...chat, canAssignCourier: value } : chat
      ),
    }))
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
