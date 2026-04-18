'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { getChats } from '@api/chats'
import { TChatItem } from '@api/chats/types'
import { useAxiosInstance } from '@api/use-axios-instance'

interface IChatsViewProps {
  adId?: string
  userId?: string
}

export const ChatsView = ({ adId, userId }: IChatsViewProps) => {
  const axios = useAxiosInstance()
  const router = useRouter()
  const [chats, setChats] = useState<TChatItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    getChats(undefined, axios)
      .then(res => {
        let data = res.data.data

        if (adId) {
          const match = data.find(c => c.adId === adId)
          if (match) {
            router.replace(`/chats/${match.id}`)
            return
          }
          data = data.filter(c => c.adId === adId)
        }

        if (userId) {
          data = data.filter(c => c.otherUser?.id === userId)
        }

        setChats(data)
      })
      .catch(error => console.error('[ChatsView] getChats failed:', error))
      .finally(() => setIsLoading(false))
  }, [adId, userId])

  if (isLoading) return <div>Загрузка...</div>

  if (chats.length === 0) return <div>Чатов не найдено</div>

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {chats.map(chat => {
        const name = chat.otherUser
          ? [chat.otherUser.firstName, chat.otherUser.lastName].filter(Boolean).join(' ') ||
            chat.otherUser.email
          : 'Неизвестный пользователь'

        return (
          <li
            key={chat.id}
            onClick={() => router.push(`/chats/${chat.id}`)}
            style={{ cursor: 'pointer', padding: '12px 0', borderBottom: '1px solid #eee' }}
          >
            <div>
              <strong>{name}</strong>
            </div>
            <div style={{ color: '#666', fontSize: 14 }}>{chat.ad.title}</div>
            {chat.lastMessage?.text && (
              <div style={{ color: '#999', fontSize: 13 }}>{chat.lastMessage.text}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
