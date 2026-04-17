'use client'

import { useSearchParams } from 'next/navigation'

import { ChatsView } from '@views/chats/view'

export default function ChatsPage() {
  const searchParams = useSearchParams()
  const adId = searchParams.get('adId') ?? undefined
  const userId = searchParams.get('userId') ?? undefined

  return <ChatsView adId={adId} userId={userId} />
}
