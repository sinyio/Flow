'use client'

import { RuntimeErrorFallback } from '@views/error-fallback'

const Error = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => (
  <RuntimeErrorFallback error={error} reset={reset} />
)

export default Error
