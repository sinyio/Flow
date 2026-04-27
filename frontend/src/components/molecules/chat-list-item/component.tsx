'use client'

import { Avatar, Text } from '@gravity-ui/uikit'

import { TChatItem } from '@api/chats/types'

import { formatUserName } from '@utils/format-user-name'

import styles from './component.module.css'

export interface IChatListItemProps {
  chat: TChatItem
  isActive?: boolean
  onClick: () => void
}

export const ChatListItem = ({ chat, isActive = false, onClick }: IChatListItemProps) => {
  const name = chat.otherUser ? formatUserName(chat.otherUser) : 'Неизвестный пользователь'

  const lastMessagePreview = chat.lastMessage?.text || 'Нет сообщений'
  const lastMessageDate = chat.lastMessage?.createdAt
    ? new Date(chat.lastMessage.createdAt).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
      })
    : ''

  const unreadCount = chat.unreadCount ?? 0

  return (
    <div
      className={`${styles.container} ${isActive ? styles.active : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className={styles.userRow}>
        <Avatar className={styles.avatar} imgUrl={chat.otherUser?.photo || ''} />

        <div className={styles.textBlock}>
          <Text variant="subheader-3" className={styles.name}>
            {name}
          </Text>
          <Text variant="body-2" color="complementary" className={styles.preview}>
            {lastMessagePreview}
          </Text>
        </div>

        <div className={styles.meta}>
          {lastMessageDate && (
            <Text variant="body-short" className={styles.date}>
              {lastMessageDate}
            </Text>
          )}
          {unreadCount > 0 && <div className={styles.unreadDot} />}
        </div>
      </div>
    </div>
  )
}
