'use client'

import { Text } from '@gravity-ui/uikit'
import Image from 'next/image'
import { ReactNode } from 'react'

import { TAuthorizationStep, useAuthorizationStore } from '@utils/stores/authorization'

import { LiquidGlassBlock } from '@components/global/liquid-glass-block'

import { ForgotPasswordStep } from './steps/forgot-password-step/step'
import { SignInStep } from './steps/sign-in-step/step'
import { SignUpStep } from './steps/sign-up-step/step'
import styles from './view.module.css'

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
    <div className={styles.authRoot}>
      <div aria-hidden="true" className={styles.background}>
        <Image
          priority
          fill
          className={styles.backgroundImage}
          alt=""
          src="/authorization/authorization-background.webp"
        />
      </div>
      <div className={styles.authInner}>
        <div className={styles.content}>
          <LiquidGlassBlock className={styles.glassBlock}>
            <Text variant="display-3" className={styles.title}>
              {headerMap[authorizationStep]}
            </Text>

            <div className={styles.divider} />

            {stepsMap[authorizationStep]}
          </LiquidGlassBlock>
        </div>
      </div>
    </div>
  )
}

export default AuthorizationView
