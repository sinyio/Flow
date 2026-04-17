'use client'

import { use } from 'react'

import { ChatRoomView } from '@views/chats/chatId/view'

interface IChatPageProps {
  params: Promise<{ chatId: string }>
}

export default function ChatPage({ params }: IChatPageProps) {
  const { chatId } = use(params)

  return <ChatRoomView chatId={chatId} />
}
