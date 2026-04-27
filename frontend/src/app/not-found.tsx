'use client'

import { useRouter } from 'next/navigation'

import { PageContainer } from '@components/global/page-container'

import { ErrorTemplate } from '@views/error-template/component'

const NotFound = () => {
  const router = useRouter()

  return (
    <PageContainer>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <ErrorTemplate
          title="Страница не найдена"
          message="По этому адресу ничего нет"
          buttonText="Вернуться на главную"
          onClick={() => router.push('/')}
        />
      </div>
    </PageContainer>
  )
}

export default NotFound
