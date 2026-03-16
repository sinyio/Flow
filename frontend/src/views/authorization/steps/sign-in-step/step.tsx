'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@gravity-ui/uikit'

import { TextLink } from '@components/text-link/component'
import { Typography } from '@components/typography/component'
import { useAuthApi } from '@utils/hooks/use-auth-api'
import { signInSchema } from '../../../../constants/validation-schema'
import styles from './step.module.css'
import { CheckboxField, EmailField, PasswordField } from '@components/form'
import { useAuthorizationStore } from '@utils/stores/authorization'
import { SignInFormValues } from 'src/types/authorization'

export const SignInStep = () => {
  const router = useRouter()
  const { login } = useAuthApi()
  const goToSignUp = useAuthorizationStore(state => state.goToSignUp)
  const goToForgotPassword = useAuthorizationStore(state => state.goToForgotPassword)
  const { control, formState, handleSubmit, setError } = useForm<SignInFormValues>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    mode: 'onChange',
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data: SignInFormValues) => {
    const result = await login.execute({ email: data.email, password: data.password })

    if ('data' in result) {
      router.push('/')
    } else {
      const { error } = result

      if (error.status === 404) {
        setError('email', { type: 'server', message: error.message })
      } else if (error.status === 401) {
        setError('password', { type: 'server', message: error.message })
      } else {
        setError('root', { type: 'server', message: error.message })
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
      <div className={styles.container}>
        <EmailField<SignInFormValues> controllerProps={{ control, name: 'email' }} />
        <div>
          <PasswordField<SignInFormValues>
            controllerProps={{ control, name: 'password' }}
            placeholder="Пароль"
          />
          <TextLink
            href="#"
            className={styles.forgotPassword}
            onClick={e => {
              e.preventDefault()
              goToForgotPassword()
            }}
          >
            Забыли пароль?
          </TextLink>
        </div>
        <CheckboxField<SignInFormValues> controllerProps={{ control, name: 'rememberMe' }} />
      </div>
      <div className={styles.enterAndRegister}>
        {formState.errors.root?.message && (
          <Typography variant="body1" style={{ color: 'var(--g-color-text-danger)' }}>
            {formState.errors.root.message}
          </Typography>
        )}
        <Button
          type="submit"
          size="xl"
          view="action"
          style={{ width: '100%' }}
          disabled={!formState.isValid || login.isLoading}
        >
          <Typography variant="header1">Войти</Typography>
        </Button>
        <div className={styles.noAccount}>
          <Typography variant="body1">Нет аккаунта?</Typography>{' '}
          <TextLink
            href="#"
            style={{ color: 'inherit' }}
            onClick={e => {
              e.preventDefault()
              goToSignUp()
            }}
          >
            Зарегистрироваться
          </TextLink>
        </div>
      </div>
    </form>
  )
}
