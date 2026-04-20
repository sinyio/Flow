'use client'

import { FileText } from '@gravity-ui/icons'
import { Avatar, Icon, Text } from '@gravity-ui/uikit'

import { TMessage } from '@api/chats/types'

import { formatUserName } from '@utils/format-user-name'

import styles from './component.module.css'

export interface IMessageBubbleProps {
  message: TMessage
  isOwn: boolean
  showAvatar?: boolean
}

export const MessageBubble = ({ message, isOwn, showAvatar = true }: IMessageBubbleProps) => {
  const senderName = formatUserName(message.sender)

  const time = new Date(message.createdAt).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className={`${styles.container} ${isOwn ? styles.own : ''}`}>
      {showAvatar && !isOwn && (
        <Avatar size="s" imgUrl={message.sender.photo || ''} className={styles.avatar} />
      )}

      <div className={styles.content}>
        {!isOwn && (
          <Text variant="caption-1" className={styles.senderName}>
            {senderName}
          </Text>
        )}

        {message.text && (
          <div className={`${styles.messageBubble} ${isOwn ? styles.ownBubble : ''}`}>
            <Text variant="body-1">{message.text}</Text>
          </div>
        )}

        {message.files.length > 0 && (
          <div className={styles.files}>
            {message.files.map(file => (
              <div key={file.id} className={styles.fileItem}>
                <Icon data={FileText} size={16} />
                <Text variant="caption-2" color="secondary">
                  {file.fileName || 'Файл'}
                </Text>
              </div>
            ))}
          </div>
        )}

        <Text variant="caption-2" color="secondary" className={styles.time}>
          {time}
        </Text>
      </div>

      {showAvatar && isOwn && (
        <Avatar size="s" imgUrl={message.sender.photo || ''} className={styles.avatar} />
      )}
    </div>
  )
}
