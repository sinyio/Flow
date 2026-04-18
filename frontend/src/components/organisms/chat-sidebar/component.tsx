'use client'

import { Loader, Tab, TabList, TabProvider, Text } from '@gravity-ui/uikit'

import { TChatItem } from '@api/chats/types'

import { ChatListItem } from '@components/molecules/chat-list-item'

import { ChatSupportBanner } from '@widgets/chat/chat-support-banner/ui'

import styles from './component.module.css'

export interface IChatSidebarProps {
  chats: TChatItem[]
  activeTab: 'all' | 'unread' | 'myads'
  onTabChange: (tab: 'all' | 'unread' | 'myads') => void
  activeChatId?: string
  onChatSelect: (chatId: string) => void
  isLoading?: boolean
}

export const ChatSidebar = ({
  chats,
  activeTab,
  onTabChange,
  activeChatId,
  onChatSelect,
  isLoading = false,
}: IChatSidebarProps) => (
  <div className={styles.container}>
    <div className={styles.header}>
      <Text variant="header-1">Все чаты</Text>
    </div>

    <TabProvider value={activeTab} onUpdate={value => onTabChange(value as typeof activeTab)}>
      <TabList size="l" className={styles.tabs}>
        <Tab value="all">Все</Tab>
        <Tab value="unread">Непрочитанные</Tab>
        <Tab value="myads">Мои объявления</Tab>
      </TabList>
    </TabProvider>

    <ChatSupportBanner />

    <div className={styles.chatList}>
      {isLoading ? (
        <div className={styles.loaderContainer}>
          <Loader size="m" />
        </div>
      ) : chats.length === 0 ? (
        <div className={styles.emptyState}>
          <Text variant="body-1" color="secondary">
            Чатов не найдено
          </Text>
        </div>
      ) : (
        chats.map(chat => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            isActive={chat.id === activeChatId}
            onClick={() => onChatSelect(chat.id)}
          />
        ))
      )}
    </div>
  </div>
)
