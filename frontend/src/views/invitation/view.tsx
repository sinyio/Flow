'use client'

import { Button, Text } from '@gravity-ui/uikit'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { acceptRecipientInvite } from '@api/ads'
import { useAxiosInstance } from '@api/use-axios-instance'

import { PageContainer } from '@components/global/page-container'

import styles from './view.module.css'

export const InvitationView = ({ token }: { token: string }) => {
  const router = useRouter()
  const axiosInstance = useAxiosInstance()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAccept = async () => {
    setIsLoading(true)
    setError('')
    try {
      const { data } = await acceptRecipientInvite(token, axiosInstance)
      if ('adId' in data) {
        router.push(`/ads/${data.adId}`)
      }
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Произошла ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageContainer>
      <div className={styles.wrapper}>
        <Text variant="display-2">Приглашение получателя</Text>
        <Text variant="body-3" color="secondary">
          Вас приглашают стать получателем посылки. Нажмите кнопку ниже, чтобы принять приглашение.
        </Text>

        {error && (
          <Text variant="body-2" color="danger">
            {error}
          </Text>
        )}

        <Button view="action" size="xl" loading={isLoading} onClick={handleAccept}>
          <Text variant="header-1">Принять приглашение</Text>
        </Button>
      </div>
    </PageContainer>
  )
}
