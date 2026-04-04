'use client'

import { Loader } from '@gravity-ui/uikit'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { useAxiosInstance } from '@api/use-axios-instance'

import { useAuthorizationStore } from '@utils/stores/authorization'

export const NewVerificationView = ({ token }: { token: string }) => {
  const axiosInstance = useAxiosInstance()
  const router = useRouter()

  const { confirmEmail } = useAuthorizationStore(store => store)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      confirmEmail({ token }, axiosInstance).finally(() => router.push('/'))
    }
  }, [token, axiosInstance, router])

  return <Loader />
}
