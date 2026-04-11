'use client'

import { Button, Link, Text, useToaster } from '@gravity-ui/uikit'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { SignUpFormValues } from 'src/types/authorization'

import { useAxiosInstance } from '@api/use-axios-instance'

import { useAuthorizationStore } from '@utils/stores/authorization'

import { CheckboxField } from '@components/form/checkbox-field/field'
import { EmailField } from '@components/form/email-field/field'
import { PasswordField } from '@components/form/password-field/field'
import { LegalBlock } from '@components/templates/legal-block'
import { PasswordRequirements } from '@components/templates/password-requirements'

import styles from './step.module.css'
import { signUpSchema } from './validation-schema'

export const SignUpStep = () => {
  const { control, handleSubmit, formState } = useForm<SignUpFormValues>({
    defaultValues: {
      email: '',
      password: '',
      repeatPassword: '',
      rememberMe: true,
    },
    mode: 'onChange',
    resolver: zodResolver(signUpSchema),
  })

  const axiosInstance = useAxiosInstance()

  const { setAuthorizationStep, register, isLoading } = useAuthorizationStore(store => store)
  const { add } = useToaster()

  const onSubmit = async (data: SignUpFormValues) => {
    await register({ email: data.email, password: data.password }, axiosInstance).catch(e =>
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
      <div className={styles.fields}>
        <EmailField<SignUpFormValues> controllerProps={{ control, name: 'email' }} />

        <PasswordField<SignUpFormValues>
          controllerProps={{ control, name: 'password' }}
          placeholder="Придумайте пароль"
        />

        <PasswordField<SignUpFormValues>
          controllerProps={{ control, name: 'repeatPassword' }}
          placeholder="Повторите пароль"
        />

        <div className={styles.reqirementsAndCheckbox}>
          <PasswordRequirements control={control} />
          <CheckboxField controllerProps={{ control, name: 'rememberMe' }} />
        </div>
      </div>
      <div className={styles.actions}>
        {formState.errors.root?.message && (
          <Text variant="body-1" style={{ color: 'var(--g-color-text-danger)' }}>
            {formState.errors.root.message}
          </Text>
        )}
        <Button
          type="submit"
          size="xl"
          view="action"
          style={{ width: '100%', marginBottom: '8px' }}
          disabled={!formState.isValid || isLoading.register}
        >
          <Text variant="header-1">Создать аккаунт</Text>
        </Button>

        <LegalBlock />

        <div className={styles.hasAccount}>
          <Text variant="body-1">Уже есть аккаунт?</Text>{' '}
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
        </div>
      </div>
    </form>
  )
}
