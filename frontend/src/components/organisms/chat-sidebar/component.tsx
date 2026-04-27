'use client'

import { Button, Loader, Text } from '@gravity-ui/uikit'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

import { useChatStore } from '@utils/stores/chats'

import { ChatListItem } from '@components/molecules/chat-list-item'

import { ChatSupportBanner } from '@widgets/chat/chat-support-banner/ui'

import styles from './component.module.css'

const TABS = [
  { value: 'all', label: 'Все' },
  { value: 'unread', label: 'Непрочитанные' },
  { value: 'myads', label: 'Мои объявления' },
] as const

export const ChatSidebar = () => {
  const router = useRouter()
  const { chats, activeTab, selectedChatId, currentUserId, isLoading, setTab, selectChat } =
    useChatStore()

  const filteredChats = useMemo(() => {
    switch (activeTab) {
      case 'unread':
        return chats.filter(chat => (chat.unreadCount ?? 0) > 0)
      case 'myads':
        return chats.filter(chat => chat.otherUser?.id !== currentUserId)
      case 'all':
      default:
        return chats
    }
  }, [chats, activeTab, currentUserId])

  const handleChatSelect = (chatId: string) => {
    selectChat(chatId)
    router.push(`/chats?chatId=${chatId}`)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text variant="display-3">Все чаты</Text>
      </div>

      <div className={styles.tabs}>
        {TABS.map(tab => (
          <Button
            key={tab.value}
            view={activeTab === tab.value ? 'action' : 'outlined'}
            size="l"
            pin="round-round"
            className={activeTab === tab.value ? styles.tabButtonActive : styles.tabButton}
            onClick={() => setTab(tab.value as typeof activeTab)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <ChatSupportBanner />

      <div className={styles.chatList}>
        {isLoading.chats ? (
          <div className={styles.loaderContainer}>
            <Loader size="m" />
          </div>
        ) : filteredChats.length === 0 ? (
          <div className={styles.emptyState}>
            <Text variant="body-1" color="secondary">
              Чатов не найдено
            </Text>
          </div>
        ) : (
          filteredChats.map(chat => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isActive={chat.id === selectedChatId}
              onClick={() => handleChatSelect(chat.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
