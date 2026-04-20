/** Сообщения бэкенда при отсутствии сессии (Nest UnauthorizedException и т.п.) */
export const SESSION_NOT_FOUND_MESSAGES = [
  'Сессия не найдена',
  'Пользователь не авторизован',
] as const

/** Nest может отдавать `message` строкой или массивом строк (валидация). */
export function getApiMessageStrings(message: unknown): readonly string[] {
  if (typeof message === 'string') {
    return [message]
  }
  if (Array.isArray(message)) {
    return message.filter((item): item is string => typeof item === 'string')
  }

  return []
}

/** Есть ли среди сообщений от API фраза о потере сессии (проверяются все элементы массива). */
export function isSessionNotFoundInApiMessage(message: unknown): boolean {
  return getApiMessageStrings(message).some(part =>
    SESSION_NOT_FOUND_MESSAGES.some(msg => part.trim() === msg)
  )
}

export function isSessionNotFoundMessage(message: string | undefined | null): boolean {
  return isSessionNotFoundInApiMessage(message)
}

/** Для отображения пользователю: первая строка из строки или массива. */
export function normalizeApiMessage(message: unknown): string | undefined {
  const parts = getApiMessageStrings(message)

  return parts[0]
}
