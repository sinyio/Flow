'use client'

import { Loader, useToaster } from '@gravity-ui/uikit'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { useAxiosInstance } from '@api/use-axios-instance'

import { useAuthorizationStore } from '@utils/stores/authorization'

export const NewVerificationView = ({ token }: { token: string }) => {
  const axiosInstance = useAxiosInstance()
  const router = useRouter()
  const { add } = useToaster()

  const confirmEmail = useAuthorizationStore(store => store.confirmEmail)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      confirmEmail({ token }, axiosInstance)
        .then(() => router.push('/'))
        .catch((e: unknown) => {
          add({
            isClosable: true,
            theme: 'danger',
            name: 'email_confirmation_error',
            title: 'Ошибка подтверждения',
            content:
              typeof e === 'object' && e !== null && 'message' in e
                ? String((e as { message: unknown }).message)
                : 'Не удалось подтвердить email',
          })
          router.push('/auth')
        })
    }
  }, [token, axiosInstance, router, confirmEmail, add])

  return <Loader />
}
