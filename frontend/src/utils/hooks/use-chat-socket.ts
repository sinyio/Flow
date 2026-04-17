'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

import { TMessage } from '@api/chats'

export function useChatSocket() {
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [newMessages, setNewMessages] = useState<TMessage[]>([])

  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_API_HOST}/chat`, {
      withCredentials: true,
    })

    socketRef.current = socket

    socket.on('connect', () => setIsConnected(true))
    socket.on('disconnect', () => setIsConnected(false))
    socket.on('message:new', (message: TMessage) => {
      setNewMessages(prev => [...prev, message])
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const joinRoom = (chatId: string): Promise<boolean> => {
    return new Promise(resolve => {
      if (!socketRef.current) {
        resolve(false)
        return
      }
      socketRef.current.emit('join', { chatId }, (response: { ok: boolean }) => {
        resolve(response.ok)
      })
    })
  }

  const sendMessage = (chatId: string, text: string): Promise<{ ok: boolean }> => {
    return new Promise(resolve => {
      if (!socketRef.current) {
        resolve({ ok: false })
        return
      }
      socketRef.current.emit('message', { chatId, text }, (response: { ok: boolean }) => {
        resolve(response)
      })
    })
  }

  return { isConnected, joinRoom, sendMessage, newMessages }
}
