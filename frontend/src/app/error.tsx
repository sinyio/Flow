'use client'

import { useRouter } from 'next/navigation'

import { PageContainer } from '@components/global/page-container'

import { ErrorTemplate } from '@views/error-template/component'

const Error = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
  const router = useRouter()

  return (
    <PageContainer
      outer={{
        style: {
          justifyContent: 'center',
        },
      }}
    >
      <ErrorTemplate
        title={(error?.cause as string) || 'Не удалось загрузить данные'}
        message={error.message}
        buttonText="Попробовать снова"
        onClick={() => router.refresh()}
      />
    </PageContainer>
  )
}

export default Error
