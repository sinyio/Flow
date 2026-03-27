'use client'

import Image from 'next/image'
import { ReactNode } from 'react'
import { Text } from '@gravity-ui/uikit'

import { LiquidGlassBlock } from '@components/global/liquid-glass-block'
import { TAuthorizationStep, useAuthorizationStore } from '@utils/stores/authorization'
import { ForgotPasswordStep } from './steps/forgot-password-step/step'
import { SignInStep } from './steps/sign-in-step/step'
import { SignUpStep } from './steps/sign-up-step/step'
import styles from './view.module.css'
import { PageContainer } from '@components/global/page-container'

const headerMap: Record<TAuthorizationStep, string> = {
  'sign-up': 'Регистрация',
  'sign-in': 'Вход',
  'forgot-password': 'Восстановление пароля',
  'check-email': 'Проверьте почту',
}

const stepsMap: Record<TAuthorizationStep, ReactNode> = {
  'sign-up': <SignUpStep />,
  'sign-in': <SignInStep />,
  'forgot-password': <ForgotPasswordStep />,
  'check-email': <div>Вы успешно зарегистрировались</div>,
}

const AuthorizationView = () => {
  const { authorizationStep } = useAuthorizationStore(store => store)

  return (
    <PageContainer>
      <div aria-hidden="true" className={styles.background}>
        <Image
          priority
          fill
          className={styles.backgroundImage}
          alt=""
          src="/authorization/authorization-background.webp"
        />
      </div>
      <div className={styles.content}>
        <LiquidGlassBlock className={styles.glassBlock}>
          <Text variant="display-3" className={styles.title}>
            {headerMap[authorizationStep]}
          </Text>

          <div className={styles.divider} />

          {stepsMap[authorizationStep]}
        </LiquidGlassBlock>
      </div>
    </PageContainer>
  )
}

export default AuthorizationView
