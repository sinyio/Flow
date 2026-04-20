'use client'

import { Loader, Tab, TabList, TabProvider, Text } from '@gravity-ui/uikit'
import { useRouter } from 'next/navigation'

import { selectFilteredChats, useChatStore } from '@utils/stores/chats'

import { ChatListItem } from '@components/molecules/chat-list-item'

import { ChatSupportBanner } from '@widgets/chat/chat-support-banner/ui'

import styles from './component.module.css'

export const ChatSidebar = () => {
  const router = useRouter()
  const { activeTab, selectedChatId, isLoading, setTab, selectChat } = useChatStore()
  const filteredChats = useChatStore(selectFilteredChats)

  const handleChatSelect = (chatId: string) => {
    selectChat(chatId)
    router.push(`/chats?chatId=${chatId}`)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text variant="header-1">Все чаты</Text>
      </div>

      <TabProvider value={activeTab} onUpdate={value => setTab(value as typeof activeTab)}>
        <TabList size="l" className={styles.tabs}>
          <Tab value="all">Все</Tab>
          <Tab value="unread">Непрочитанные</Tab>
          <Tab value="myads">Мои объявления</Tab>
        </TabList>
      </TabProvider>

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
