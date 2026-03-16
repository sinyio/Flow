'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@gravity-ui/uikit'

import { PasswordRequirements } from '@components/password-requirements/component'
import { TextLink } from '@components/text-link/component'
import { Typography } from '@components/typography/component'
import { EmailField } from '@components/form/email-field/field'
import { PasswordField } from '@components/form/password-field/field'
import { CheckboxField } from '@components/form/checkbox-field/field'
import { LegalBlock } from '@components/legal-block/component'
import { useAuthApi } from '@utils/hooks/use-auth-api'
import { useAuthorizationStore } from '@utils/stores/authorization'
import { getPasswordRequirementItems } from '@utils/password-check'
import { SignUpFormValues } from 'src/types/authorization'
import { signUpSchema } from 'src/constants/validation-schema'
import styles from './step.module.css'

export const SignUpStep = () => {
  const goToSignIn = useAuthorizationStore(state => state.goToSignIn)
  const { register: registerUser } = useAuthApi()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const { control, handleSubmit, formState, watch, setError } = useForm<SignUpFormValues>({
    defaultValues: {
      email: '',
      password: '',
      repeatPassword: '',
      rememberMe: true,
    },
    mode: 'onChange',
    resolver: zodResolver(signUpSchema),
  })

  const passwordValue = watch('password')
  const passwordHasError = Boolean(formState.errors.password)
  const requirementItems = getPasswordRequirementItems(passwordValue ?? '', passwordHasError)

  const onSubmit = async (data: SignUpFormValues) => {
    setSuccessMessage(null)
    const result = await registerUser.execute({ email: data.email, password: data.password })

    if ('data' in result) {
      setSuccessMessage(result.data.message ?? 'Вы успешно зарегистрировались. Подтвердите email.')
    } else {
      const { error } = result

      if (error.status === 409) {
        setError('email', { type: 'server', message: error.message })
      } else {
        setError('root', { type: 'server', message: error.message })
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
      <div className={styles.fields}>
        {successMessage && (
          <Typography variant="body1" style={{ color: 'var(--g-color-text-positive)' }}>
            {successMessage}
          </Typography>
        )}
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
          <PasswordRequirements items={requirementItems} />
          <CheckboxField controllerProps={{ control, name: 'rememberMe' }} />
        </div>
      </div>
      <div className={styles.actions}>
        {formState.errors.root?.message && (
          <Typography variant="body1" style={{ color: 'var(--g-color-text-danger)' }}>
            {formState.errors.root.message}
          </Typography>
        )}
        <Button
          type="submit"
          size="xl"
          view="action"
          style={{ width: '100%', marginBottom: '8px' }}
          disabled={!formState.isValid || registerUser.isLoading}
        >
          <Typography variant="header1">Создать аккаунт</Typography>
        </Button>

        <LegalBlock />

        <div className={styles.hasAccount}>
          <Typography variant="body1">Уже есть аккаунт?</Typography>{' '}
          <TextLink
            style={{ color: 'inherit' }}
            href="#"
            onClick={e => {
              e.preventDefault()
              goToSignIn()
            }}
          >
            Войти
          </TextLink>
        </div>
      </div>
    </form>
  )
}
