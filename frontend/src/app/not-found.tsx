'use client'

import { useRouter } from 'next/navigation'

import { PageContainer } from '@components/global/page-container'

import { ErrorTemplate } from '@views/error-template/component'

const NotFound = () => {
  const router = useRouter()

  return (
    <PageContainer>
      <ErrorTemplate
        title="Страница не найдена"
        message="По этому адресу ничего нет"
        buttonText="Вернуться на главную"
        onClick={() => router.push('/')}
      />
    </PageContainer>
  )
}

export default NotFound
