'use client'

import { Label, Text, User, Avatar } from '@gravity-ui/uikit'

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
      <div className={styles.userSection}>
        <User
          size="m"
          name={name}
          avatar={<Avatar size="m" imgUrl={chat.otherUser?.photo || ''} />}
        />
        {lastMessageDate && (
          <Text variant="caption-2" color="secondary" className={styles.date}>
            {lastMessageDate}
          </Text>
        )}
      </div>

      <div className={styles.messagePreview}>
        <Text variant="body-2" color="secondary" className={styles.preview}>
          {lastMessagePreview}
        </Text>
        {unreadCount > 0 && (
          <Label size="xs" theme="danger">
            {unreadCount}
          </Label>
        )}
      </div>
    </div>
  )
}
