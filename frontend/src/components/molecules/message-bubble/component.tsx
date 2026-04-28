'use client'

import { Check, FileText } from '@gravity-ui/icons'
import { Avatar, Icon, Text } from '@gravity-ui/uikit'

import { TMessage } from '@api/chats/types'

import styles from './component.module.css'

export interface IMessageBubbleProps {
  message: TMessage
  isOwn: boolean
  showAvatar?: boolean
}

export const MessageBubble = ({ message, isOwn, showAvatar = true }: IMessageBubbleProps) => {
  const time = new Date(message.createdAt).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className={`${styles.container} ${isOwn ? styles.own : ''}`}>
      {showAvatar ? (
        <Avatar size="l" imgUrl={message.sender.photo || ''} className={styles.avatar} />
      ) : (
        <div className={styles.avatarSpacer} />
      )}

      <div className={`${styles.messageBubble} ${isOwn ? styles.ownBubble : ''}`}>
        {message.text && (
          <Text variant="body-2" className={styles.messageText}>
            {message.text}
          </Text>
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
      </div>

      <div className={styles.timeBlock}>
        {isOwn && <Icon data={Check} size={16} className={styles.checkIcon} />}
        <Text variant="caption-2" color="hint" className={styles.time}>
          {time}
        </Text>
      </div>
    </div>
  )
}
