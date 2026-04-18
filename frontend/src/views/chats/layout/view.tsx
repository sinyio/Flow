'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { me } from '@api/auth'
import { getChats, getMessages } from '@api/chats'
import { TChatItem, TMessage } from '@api/chats/types'
import { useAxiosInstance } from '@api/use-axios-instance'

import { useChatSocket } from '@utils/hooks/use-chat-socket'

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

  const [chats, setChats] = useState<TChatItem[]>([])
  const [selectedChatId, setSelectedChatId] = useState<string | null>(initialChatId || null)
  const [initialMessages, setInitialMessages] = useState<TMessage[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'myads'>('all')
  const [isLoadingChats, setIsLoadingChats] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string>('')

  const { isConnected, joinRoom, sendMessage, newMessages } = useChatSocket()

  // Получение currentUserId из API /auth/me
  useEffect(() => {
    me(axios)
      .then(res => {
        if ('userId' in res.data) {
          setCurrentUserId(res.data.userId)
        }
      })
      .catch(error => console.error('[ChatLayout] me failed:', error))
  }, [axios])

  // Загрузка списка чатов
  useEffect(() => {
    setIsLoadingChats(true)
    getChats(undefined, axios)
      .then(res => {
        setChats(res.data.data)
      })
      .catch(error => console.error('[ChatLayout] getChats failed:', error))
      .finally(() => setIsLoadingChats(false))
  }, [axios])

  // Обновление selectedChatId из URL
  useEffect(() => {
    const chatId = searchParams.get('chatId')

    if (chatId && chatId !== selectedChatId) {
      setSelectedChatId(chatId)
    }
  }, [searchParams, selectedChatId])

  // Загрузка сообщений при выборе чата
  useEffect(() => {
    if (!selectedChatId) {
      setInitialMessages([])

      return
    }

    getMessages(selectedChatId, undefined, axios)
      .then(res => {
        setInitialMessages([...res.data.data].reverse())
      })
      .catch(error => console.error('[ChatLayout] getMessages failed:', error))
  }, [selectedChatId, axios])

  // Socket.io: присоединение к комнате
  useEffect(() => {
    if (isConnected && selectedChatId) {
      joinRoom(selectedChatId)
    }
  }, [isConnected, selectedChatId, joinRoom])

  // Объединение initial + new messages с дедупликацией
  const allMessages = useMemo(() => {
    const filtered = newMessages.filter(
      m => m.chatId === selectedChatId && !initialMessages.some(im => im.id === m.id)
    )

    return [...initialMessages, ...filtered]
  }, [initialMessages, newMessages, selectedChatId])

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId)
    router.push(`/chats?chatId=${chatId}`)
  }

  const handleTabChange = (tab: 'all' | 'unread' | 'myads') => {
    setActiveTab(tab)
    // TODO: Фильтрация чатов по табам когда backend будет возвращать unreadCount и isMyAd
  }

  const handleSendMessage = async (text: string) => {
    if (!selectedChatId) return

    setIsSending(true)
    const result = await sendMessage(selectedChatId, text)

    if (!result.ok) {
      console.error('[ChatLayout] sendMessage failed')
    }
    setIsSending(false)
  }

  const selectedChat = chats.find(c => c.id === selectedChatId)

  // Фильтрация чатов по активному табу
  const filteredChats = useMemo(() => {
    switch (activeTab) {
      case 'unread':
        // Фильтруем по unreadCount если backend возвращает это поле
        return chats.filter(chat => (chat.unreadCount ?? 0) > 0)
      case 'myads':
        // Фильтруем по объявлениям текущего пользователя
        // Объявление "моё" если я не otherUser (то есть я создатель чата)
        return chats.filter(chat => {
          if (!chat.otherUser) return false

          return chat.otherUser.id !== currentUserId
        })
      case 'all':
      default:
        return chats
    }
  }, [chats, activeTab, currentUserId])

  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <ChatSidebar
          chats={filteredChats}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          activeChatId={selectedChatId || undefined}
          onChatSelect={handleChatSelect}
          isLoading={isLoadingChats}
        />
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

            <ChatRoom
              chatId={selectedChatId!}
              messages={allMessages}
              currentUserId={currentUserId}
              onSendMessage={handleSendMessage}
              isSending={isSending}
            />
          </>
        ) : (
          <div className={styles.emptyState}>
            <p>Выберите чат</p>
          </div>
        )}
      </div>
    </div>
  )
}
