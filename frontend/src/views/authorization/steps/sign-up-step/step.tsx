import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, useToaster } from '@gravity-ui/uikit'

import { PasswordRequirements } from '@components/password-requirements/component'
import { TextLink } from '@components/text-link/component'
import { Typography } from '@components/typography/component'
import { EmailField } from '@components/form/email-field/field'
import { PasswordField } from '@components/form/password-field/field'
import { CheckboxField } from '@components/form/checkbox-field/field'
import { LegalBlock } from '@components/legal-block/component'
import { getPasswordRequirementItems } from '@utils/password-check'
import { SignUpFormValues } from 'src/types/authorization'
import { signUpSchema } from 'src/constants/validation-schema'
import styles from './step.module.scss'
import { useAuthorizationStore } from '@utils/stores/authorization'
import { useAxiosInstance } from '@api/use-axios-instance'

export const SignUpStep = () => {
  const { control, handleSubmit, formState, watch } = useForm<SignUpFormValues>({
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
          disabled={!formState.isValid || isLoading.register}
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
              setAuthorizationStep('sign-in')
            }}
          >
            Войти
          </TextLink>
        </div>
      </div>
    </form>
  )
}
