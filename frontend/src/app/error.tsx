'use client'

import { PageContainer } from '@components/global/page-container'

import { RuntimeErrorFallback } from '@views/error-fallback'

const Error = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => (
  <PageContainer>
    <RuntimeErrorFallback error={error} reset={reset} />
  </PageContainer>
)

export default Error
