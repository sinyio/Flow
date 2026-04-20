'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { useAxiosInstance } from '@api/use-axios-instance'

import { useChatSocket } from '@utils/hooks/use-chat-socket'
import { selectSelectedChat, useChatStore } from '@utils/stores/chats'

import { ChatHeader } from '@components/organisms/chat-header'
import { ChatRoom } from '@components/organisms/chat-room'
import { ChatSidebar } from '@components/organisms/chat-sidebar'

import styles from './view.module.css'

export interface IChatLayoutProps {
  initialChatId?: string
}

export const ChatLayout = ({ initialChatId }: IChatLayoutProps) => {
  const axios = useAxiosInstance()
  const router = useRouter()
  const searchParams = useSearchParams()

  const {
    chats,
    selectedChatId,
    loadCurrentUser,
    loadChats,
    loadMessages,
    selectChat,
    sendMessage,
    addIncomingMessage,
  } = useChatStore()

  const selectedChat = useChatStore(selectSelectedChat)

  const { isConnected, joinRoom, sendMessage: socketSendMessage, newMessages } = useChatSocket()

  // Инициализация: initialChatId из props
  useEffect(() => {
    if (initialChatId) {
      selectChat(initialChatId)
    }
  }, [initialChatId, selectChat])

  // Загрузка currentUserId и списка чатов
  useEffect(() => {
    loadCurrentUser(axios)
    loadChats(axios)
  }, [axios, loadCurrentUser, loadChats])

  // Синхронизация URL → selectedChatId
  useEffect(() => {
    const chatId = searchParams.get('chatId')
    const userId = searchParams.get('userId')

    if (chatId && chatId !== selectedChatId) {
      selectChat(chatId)
    } else if (userId && chats.length > 0) {
      const foundChat = chats.find(chat => chat.otherUser?.id === userId)

      if (foundChat && foundChat.id !== selectedChatId) {
        selectChat(foundChat.id)
        router.replace(`/chats?chatId=${foundChat.id}`)
      } else if (!foundChat && !selectedChatId) {
        console.warn(`[ChatLayout] Чат с пользователем ${userId} не найден`)
      }
    }
  }, [searchParams, selectedChatId, chats, router, selectChat])

  // Загрузка сообщений при смене чата
  useEffect(() => {
    if (selectedChatId) {
      loadMessages(selectedChatId, axios)
    }
  }, [selectedChatId, axios, loadMessages])

  // Socket: присоединение к комнате
  useEffect(() => {
    if (isConnected && selectedChatId) {
      joinRoom(selectedChatId)
    }
  }, [isConnected, selectedChatId, joinRoom])

  // Socket → store bridge: новые сообщения
  useEffect(() => {
    if (newMessages.length === 0) return

    const lastMessage = newMessages[newMessages.length - 1]

    addIncomingMessage(lastMessage)
  }, [newMessages, addIncomingMessage])

  const handleSendMessage = async (text: string) => {
    if (!selectedChatId) return
    await sendMessage(selectedChatId, text, socketSendMessage)
  }

  return (
    <>
      <div className={styles.header} />
      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <ChatSidebar />
        </div>

        <div className={styles.room}>
          {selectedChat ? (
            <>
              {selectedChat.otherUser && (
                <ChatHeader
                  otherUser={selectedChat.otherUser}
                  ad={selectedChat.ad}
                  onMenuAction={action => console.log('Menu action:', action)}
                />
              )}

              <ChatRoom onSendMessage={handleSendMessage} />
            </>
          ) : (
            <div className={styles.emptyState}>
              <p>
                {searchParams.get('userId') && chats.length > 0
                  ? 'Чат с этим пользователем не найден'
                  : 'Выберите чат'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
