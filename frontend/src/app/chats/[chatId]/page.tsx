import { redirect } from 'next/navigation'
import { use } from 'react'

interface IChatPageProps {
  params: Promise<{ chatId: string }>
}

export default function ChatPage({ params }: IChatPageProps) {
  const { chatId } = use(params)

  // Редирект на новую страницу с query params для обратной совместимости
  redirect(`/chats?chatId=${chatId}`)
}
