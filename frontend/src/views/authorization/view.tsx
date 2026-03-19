'use client'

import Image from 'next/image'
import { ReactNode } from 'react'

import { LiquidGlassBlock } from '@components/liquid-glass-block/component'
import { Typography } from '@components/typography/component'
import { TAuthorizationStep, useAuthorizationStore } from '@utils/stores/authorization'
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
    <>
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
          <Typography variant="display3" className={styles.title}>
            {headerMap[authorizationStep]}
          </Typography>

          <div className={styles.divider} />

          {stepsMap[authorizationStep]}
        </LiquidGlassBlock>
      </div>
    </>
  )
}

export default AuthorizationView
