import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Link, Text, useToaster } from '@gravity-ui/uikit'
import { useRouter } from 'next/navigation'

import { signInSchema } from './validation-schema'
import styles from './step.module.css'
import { CheckboxField, EmailField, PasswordField } from '@components/form'
import { SignInFormValues } from 'src/types/authorization'
import { useAuthorizationStore } from '@utils/stores/authorization'
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

  const { add } = useToaster()

  const { setAuthorizationStep, login, isLoading } = useAuthorizationStore(store => store)

  const onSubmit = async (data: SignInFormValues) => {
    await login({ email: data.email, password: data.password }, axiosInstance)
      .then(response => {
        if ('status' in response) {
          router.push('/')
        }
      })
      .catch(e =>
        add({
          isClosable: true,
          theme: 'warning',
          name: 'register_error',
          title: 'Ошибка',
          content: e.message,
        })
      )
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
          <Link
            href="#"
            view="secondary"
            className={styles.forgotPassword}
            onClick={e => {
              e.preventDefault()
              setAuthorizationStep('forgot-password')
            }}
          >
            Забыли пароль?
          </Link>
        </div>
        <CheckboxField<SignInFormValues> controllerProps={{ control, name: 'rememberMe' }} />
      </div>
      <div className={styles.enterAndRegister}>
        {formState.errors.root?.message && (
          <Text variant="body-1" style={{ color: 'var(--g-color-text-danger)' }}>
            {formState.errors.root.message}
          </Text>
        )}
        <Button
          type="submit"
          size="xl"
          view="action"
          style={{ width: '100%' }}
          disabled={!formState.isValid || isLoading.login}
        >
          <Text variant="header-1">Войти</Text>
        </Button>
        <div className={styles.noAccount}>
          <Text variant="body-1">Нет аккаунта?</Text>{' '}
          <Link
            href="#"
            view="secondary"
            onClick={e => {
              e.preventDefault()
              setAuthorizationStep('sign-up')
            }}
          >
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </form>
  )
}
