import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ForgotPasswordFormValues } from 'src/types/authorization'

import { EmailField } from '@components/form'
import { TextLink } from '@components/text-link/component'
import { Typography } from '@components/typography/component'
import { useAuthorizationStore } from '@utils/stores/authorization'
import { forgotPasswordSchema } from 'src/constants/validation-schema'
import styles from './step.module.css'
import { useAxiosInstance } from '@api/use-axios-instance'
import { Button } from '@gravity-ui/uikit'

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
      console.log(data)
    },
    [axiosInstance, checkIsAuth]
  )

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className={styles.container}>
      <Typography variant="body1" className={styles.description}>
        Введите email, который вы использовали при регистрации.
      </Typography>

      <EmailField<ForgotPasswordFormValues> controllerProps={{ control, name: 'email' }} />

      <div className={styles.actions}>
        <Button
          type="submit"
          size="xl"
          view="action"
          style={{ width: '100%' }}
          disabled={!formState.isValid || isLoading.checkIsAuth}
        >
          <Typography variant="header1">Отправить</Typography>
        </Button>

        <div className={styles.links}>
          <TextLink
            href="#"
            style={{ color: 'inherit' }}
            onClick={e => {
              e.preventDefault()
              setAuthorizationStep('sign-in')
            }}
          >
            Войти
          </TextLink>
          <TextLink
            href="#"
            style={{ color: 'inherit' }}
            onClick={e => {
              e.preventDefault()
              setAuthorizationStep('sign-up')
            }}
          >
            Создать аккаунт
          </TextLink>
        </div>
      </div>
    </form>
  )
}
