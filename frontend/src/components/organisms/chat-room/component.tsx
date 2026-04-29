'use client'

import { Text } from '@gravity-ui/uikit'
import { useEffect, useRef } from 'react'

import { TMessage } from '@api/chats/types'

import { selectSelectedChat, useChatStore } from '@utils/stores/chats'

import { ChatInputBar } from '@components/molecules/chat-input-bar'
import { DealConfirmBar } from '@components/molecules/deal-confirm-bar'
import { MessageBubble } from '@components/molecules/message-bubble'

import styles from './component.module.css'

export interface IChatRoomProps {
  onSendMessage: (text: string) => Promise<void>
  onConfirmDeal?: () => void
  isConfirming?: boolean
  showDealBar?: boolean
}

export const ChatRoom = ({
  onSendMessage,
  onConfirmDeal,
  isConfirming,
  showDealBar,
}: IChatRoomProps) => {
  const { messages, currentUserId, isLoading } = useChatStore()
  const selectedChat = useChatStore(selectSelectedChat)
  const adId = selectedChat?.adId ?? null

  const bottomRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const isFirstLoad = useRef(true)

  // Скролл к концу при загрузке и при новых сообщениях (если близко к низу)
  useEffect(() => {
    const container = messagesContainerRef.current

    if (!container || messages.length === 0) return

    if (isFirstLoad.current) {
      isFirstLoad.current = false
      bottomRef.current?.scrollIntoView()
      return
    }

    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100

    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleSend = async (text: string) => {
    await onSendMessage(text)
  }

  // Группировка сообщений по датам
  const groupedMessages = messages.reduce(
    (acc, message) => {
      const date = new Date(message.createdAt).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })

      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(message)

      return acc
    },
    {} as Record<string, TMessage[]>
  )

  return (
    <div className={styles.container}>
      <div className={styles.messagesContainer} ref={messagesContainerRef}>
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date} className={styles.dateGroup}>
            <div className={styles.dateDivider}>
              <Text variant="body-1" color="hint">
                {date}
              </Text>
            </div>

            {msgs.map((message, index) => {
              const isOwn = message.sender.id === currentUserId
              const prevMessage = index > 0 ? msgs[index - 1] : null
              const showAvatar = !prevMessage || prevMessage.sender.id !== message.sender.id

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={isOwn}
                  showAvatar={showAvatar}
                  adId={adId}
                  isConfirmed={selectedChat?.isCourierConfirmed}
                />
              )
            })}
          </div>
        ))}

        {showDealBar && onConfirmDeal && (
          <DealConfirmBar onConfirm={onConfirmDeal} isLoading={isConfirming} />
        )}

        <div ref={bottomRef} />
      </div>

      <ChatInputBar
        onSend={(text, files) => {
          // TODO: Когда backend будет поддерживать файлы, передать их в socket.io
          if (files && files.length > 0) {
            console.log('Selected files:', files)
            console.warn('File upload not yet implemented in backend')
          }
          handleSend(text)
        }}
        disabled={isLoading.sendMessage}
      />
    </div>
  )
}
