'use client'

import { useSearchParams } from 'next/navigation'

import { ChatLayout } from '@views/chats/layout'

const ChatsPage = () => {
  const searchParams = useSearchParams()
  const chatId = searchParams.get('chatId') ?? undefined

  // TODO: Поддержка adId и userId фильтров если нужно
  // const adId = searchParams.get('adId') ?? undefined
  // const userId = searchParams.get('userId') ?? undefined

  return <ChatLayout initialChatId={chatId} />
}

export default ChatsPage
