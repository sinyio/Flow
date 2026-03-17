'use client'

import { Loader } from '@gravity-ui/uikit'
import { useEffect } from 'react'

import { useAxiosInstance } from '@api/use-axios-instance'
import { PageContainer } from '@components/page-container/component'
import { useAuthorizationStore } from '@utils/stores/authorization'

export const NewVerificationView = ({ token }: { token: string }) => {
  const axiosInstance = useAxiosInstance()

  const { confirmEmail } = useAuthorizationStore(store => store)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      void confirmEmail({ token }, axiosInstance)
    }
  }, [token, axiosInstance, confirmEmail])

  return (
    <PageContainer>
      <Loader />
    </PageContainer>
  )
}
