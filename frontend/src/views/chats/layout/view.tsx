'use client'

import { Text } from '@gravity-ui/uikit'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { assignCourier } from '@api/ads/assign-courier'
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
    clearSelection,
    sendMessage,
    addIncomingMessage,
    handleChatActivity,
    setCanAssignCourier,
  } = useChatStore()

  const [isConfirming, setIsConfirming] = useState(false)

  const selectedChat = useChatStore(selectSelectedChat)

  const { isConnected, joinRoom, sendMessage: socketSendMessage, newMessages, chatActivities } = useChatSocket()

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

  // Socket → store bridge: новые сообщения в открытом чате
  useEffect(() => {
    if (newMessages.length === 0) return

    const lastMessage = newMessages[newMessages.length - 1]

    addIncomingMessage(lastMessage)
  }, [newMessages, addIncomingMessage])

  // Socket → store bridge: новые сообщения в других чатах (счётчик непрочитанных)
  useEffect(() => {
    if (chatActivities.length === 0) return

    const last = chatActivities[chatActivities.length - 1]

    handleChatActivity(last.chatId, last.message)
  }, [chatActivities, handleChatActivity])

  const handleSendMessage = async (text: string) => {
    if (!selectedChatId) return
    await sendMessage(selectedChatId, text, socketSendMessage)
  }

  const handleConfirmDeal = async () => {
    if (!selectedChat?.adId || !selectedChat.otherUser) return

    setIsConfirming(true)
    try {
      await assignCourier({ adId: selectedChat.adId, courierId: selectedChat.otherUser.id }, axios)
      setCanAssignCourier(selectedChat.id, false)
    } catch (err) {
      console.error('[ChatLayout] assignCourier failed:', err)
    } finally {
      setIsConfirming(false)
    }
  }

  const showDealBar = selectedChat?.canAssignCourier === true

  const handleBack = () => {
    clearSelection()
    router.replace('/chats')
  }

  return (
    <>
      <div className={styles.header} />
      <div className={styles.layout}>
        <div className={`${styles.sidebar} ${selectedChatId ? styles.sidebarHidden : ''}`}>
          <ChatSidebar />
        </div>

        <div className={`${styles.room} ${!selectedChatId ? styles.roomHidden : ''}`}>
          {selectedChat ? (
            <>
              {selectedChat.otherUser && (
                <ChatHeader
                  otherUser={selectedChat.otherUser}
                  ad={selectedChat.ad}
                  onMenuAction={action => console.log('Menu action:', action)}
                  onBack={handleBack}
                />
              )}

              <ChatRoom
                onSendMessage={handleSendMessage}
                onConfirmDeal={handleConfirmDeal}
                isConfirming={isConfirming}
                showDealBar={showDealBar}
              />
            </>
          ) : (
            <div className={styles.emptyState}>
              <Text variant="subheader-3" color="hint">
                {searchParams.get('userId') && chats.length > 0
                  ? 'Чат с этим пользователем не найден'
                  : 'Выберите чат для просмотра сообщений'}
              </Text>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
