'use client'

import { useRouter } from 'next/navigation'

const shellStyles = {
  root: { padding: '24px 16px' } as const,
  title: { fontSize: '1.25rem', margin: '0 0 8px' } as const,
  text: { margin: '0 0 16px', opacity: 0.7 } as const,
}

type IShellProps = {
  title: string
  message: string
  onRetry: () => void
}

const ErrorFallbackShell = ({ title, message, onRetry }: IShellProps) => (
  <div style={shellStyles.root}>
    <h2 style={shellStyles.title}>{title}</h2>
    <p style={shellStyles.text}>{message}</p>
    <button type="button" onClick={onRetry}>
      Попробовать снова
    </button>
  </div>
)

/** Ожидаемый сбой загрузки (без throw) — не засоряет консоль в dev */
export const LoadErrorFallback = ({ message }: { message: string }) => {
  const router = useRouter()

  return (
    <ErrorFallbackShell
      title="Не удалось загрузить данные"
      message={message}
      onRetry={() => router.refresh()}
    />
  )
}

/** Неожиданные ошибки рендера — для app/error.tsx */
export const RuntimeErrorFallback = ({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) => <ErrorFallbackShell title="Что-то пошло не так" message={error.message} onRetry={reset} />
