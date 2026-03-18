'use client'

import { Loader } from '@gravity-ui/uikit'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

import { useAxiosInstance } from '@api/use-axios-instance'
import { PageContainer } from '@components/page-container/component'
import { useAuthorizationStore } from '@utils/stores/authorization'

export const NewVerificationView = ({ token }: { token: string }) => {
  const axiosInstance = useAxiosInstance()
  const router = useRouter()

  const { confirmEmail } = useAuthorizationStore(store => store)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      confirmEmail({ token }, axiosInstance).finally(() => router.push('/'))
    }
  }, [token, axiosInstance, confirmEmail])

  return (
    <PageContainer>
      <Loader />
    </PageContainer>
  )
}
