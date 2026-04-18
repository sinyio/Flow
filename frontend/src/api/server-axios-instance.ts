import axios from 'axios'
import { cookies } from 'next/headers'

/**
 * Серверный аналог useAxiosInstance() для использования в Server Components.
 * Автоматически пробрасывает cookie пользователя в запросы к API.
 */
export async function getServerAxiosInstance() {
  const cookieHeader = (await cookies()).toString()

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_HOST,
    headers: {
      Cookie: cookieHeader,
      'Content-Type': 'application/json',
    },
  })
}
