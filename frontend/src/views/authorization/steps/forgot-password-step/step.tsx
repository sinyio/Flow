'use client'

import { Button, Link, Text } from '@gravity-ui/uikit'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import type { ForgotPasswordFormValues } from 'src/types/authorization'

import { sendPasswordResetToken } from '@api/auth/send-password-reset-token'
import { useAxiosInstance } from '@api/use-axios-instance'

import { useAuthorizationStore } from '@utils/stores/authorization'

import { EmailField } from '@components/form'

import styles from './step.module.css'
import { forgotPasswordSchema } from './validation-schema'

export const ForgotPasswordStep = () => {
  const axiosInstance = useAxiosInstance()
  const { setAuthorizationStep, isLoading, checkIsAuth } = useAuthorizationStore(store => store)

  const { control, formState, handleSubmit } = useForm<ForgotPasswordFormValues>({
    defaultValues: { email: '' },
    mode: 'onChange',
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = useCallback(
    (data: ForgotPasswordFormValues) => {
      void checkIsAuth(axiosInstance)
      void sendPasswordResetToken({ email: data.email }, axiosInstance)
    },
    [axiosInstance, checkIsAuth]
  )

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className={styles.container}>
      <Text variant="body-1" className={styles.description}>
        Введите email, который вы использовали при регистрации.
      </Text>

      <EmailField<ForgotPasswordFormValues> controllerProps={{ control, name: 'email' }} />

      <div className={styles.actions}>
        <Button
          type="submit"
          size="xl"
          view="action"
          style={{ width: '100%' }}
          disabled={!formState.isValid || isLoading.checkIsAuth}
        >
          <Text variant="header-1">Отправить</Text>
        </Button>

        <div className={styles.links}>
          <Link
            href="#"
            view="secondary"
            onClick={e => {
              e.preventDefault()
              setAuthorizationStep('sign-in')
            }}
          >
            Войти
          </Link>
          <Link
            href="#"
            view="secondary"
            onClick={e => {
              e.preventDefault()
              setAuthorizationStep('sign-up')
            }}
          >
            Создать аккаунт
          </Link>
        </div>
      </div>
    </form>
  )
}
