'use client'

import Image from 'next/image'
import { ReactNode } from 'react'

import { LiquidGlassBlock } from '@components/liquid-glass-block/component'
import { PageContainer } from '@components/page-container/component'
import { Typography } from '@components/typography/component'
import { TAuthorizationStep, useAuthorizationStore } from '@utils/stores/authorization'
import { useResponsive } from '@utils/hooks/use-responsive'
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
  'check-email': <div>Проверьте почту</div>,
}

const AuthorizationView = () => {
  const device = useResponsive()

  const { authorizationStep } = useAuthorizationStore(store => store)

  return (
    <PageContainer>
      <Image
        aria-hidden
        width={3076}
        height={4096}
        className={styles.backgroundImage}
        alt=""
        src="/authorization/authorization-background.webp"
      />
      <LiquidGlassBlock className={styles.glassBlock}>
        {device === 'mobile' ? (
          <Image src="/logo.png" alt="" width={200} height={100} className={styles.flowImage} />
        ) : (
          <>
            <Typography variant="display3" className={styles.title}>
              {headerMap[authorizationStep]}
            </Typography>

            <div className={styles.divider} />
          </>
        )}
        {stepsMap[authorizationStep]}
      </LiquidGlassBlock>
    </PageContainer>
  )
}

export default AuthorizationView
