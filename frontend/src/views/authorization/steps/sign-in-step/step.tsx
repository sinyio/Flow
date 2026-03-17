import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@gravity-ui/uikit'

import { TextLink } from '@components/text-link/component'
import { Typography } from '@components/typography/component'
import { signInSchema } from '../../../../constants/validation-schema'
import styles from './step.module.css'
import { CheckboxField, EmailField, PasswordField } from '@components/form'
import { SignInFormValues } from 'src/types/authorization'
import { useAuthorizationStore } from '@utils/stores/authorization'
import { useRouter } from 'next/navigation'
import { useAxiosInstance } from '@api/use-axios-instance'

export const SignInStep = () => {
  const { control, formState, handleSubmit } = useForm<SignInFormValues>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    mode: 'onChange',
    resolver: zodResolver(signInSchema),
  })

  const axiosInstance = useAxiosInstance()
  const router = useRouter()

  const { setAuthorizationStep, login, isLoading } = useAuthorizationStore(store => store)

  const onSubmit = async (data: SignInFormValues) => {
    const response = await login(data, axiosInstance)

    if ('status' in response) {
      router.push('/')
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
              setAuthorizationStep('forgot-password')
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
          disabled={!formState.isValid || isLoading.login}
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
              setAuthorizationStep('sign-up')
            }}
          >
            Зарегистрироваться
          </TextLink>
        </div>
      </div>
    </form>
  )
}
