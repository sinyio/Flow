'use client'

import { useEffect, useRef, useState } from 'react'

import { getMessages } from '@api/chats'
import { TMessage } from '@api/chats/types'
import { useAxiosInstance } from '@api/use-axios-instance'
import { useChatSocket } from '@utils/hooks/use-chat-socket'

interface IChatRoomViewProps {
  chatId: string
}

export const ChatRoomView = ({ chatId }: IChatRoomViewProps) => {
  const axios = useAxiosInstance()
  const { isConnected, joinRoom, sendMessage, newMessages } = useChatSocket()
  const [initialMessages, setInitialMessages] = useState<TMessage[]>([])
  const [text, setText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getMessages(chatId, undefined, axios)
      .then(res => {
        setInitialMessages([...res.data.data].reverse())
      })
      .catch(error => console.error('[ChatRoomView] getMessages failed:', error))
  }, [chatId])

  useEffect(() => {
    if (isConnected) {
      joinRoom(chatId)
    }
  }, [isConnected, chatId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [initialMessages, newMessages])

  const filteredNew = newMessages.filter(
    m => m.chatId === chatId && !initialMessages.some(im => im.id === m.id)
  )
  const messages = [...initialMessages, ...filteredNew]

  const handleSend = async () => {
    if (!text.trim()) return
    setIsSending(true)
    const result = await sendMessage(chatId, text.trim())
    if (!result.ok) {
      console.error('[ChatRoomView] sendMessage failed:', result)
    }
    setText('')
    setIsSending(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {messages.map(msg => {
          const senderName =
            [msg.sender.firstName, msg.sender.lastName].filter(Boolean).join(' ') ||
            msg.sender.email

          return (
            <div key={msg.id} style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{senderName}</div>
              {msg.text && <div>{msg.text}</div>}
              {msg.files.length > 0 && (
                <div style={{ fontSize: 12, color: '#666' }}>
                  {msg.files.length} вложений
                </div>
              )}
              <div style={{ fontSize: 11, color: '#999' }}>
                {new Date(msg.createdAt).toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: 'flex', gap: 8, padding: 16, borderTop: '1px solid #eee' }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Введите сообщение..."
          disabled={isSending}
          style={{ flex: 1, padding: '8px 12px', fontSize: 14 }}
        />
        <button onClick={handleSend} disabled={isSending || !text.trim()}>
          Отправить
        </button>
      </div>
    </div>
  )
}
